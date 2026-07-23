import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import pLimit from 'p-limit'

const prisma = new PrismaClient()
const limit = pLimit(1) // 并发为1，慢慢跑不怕超时

function parseFileInfo(filename: string) {
  const cleanName = filename.replace(/\.txt$/, '')
  let title = cleanName
  let author = '未知'

  const titleMatch = cleanName.match(/《(.*?)》/)
  if (titleMatch) title = titleMatch[1]

  const authorMatch = cleanName.match(/作者[：:](.*?)(?:\.txt|$|\s)/)
  if (authorMatch) author = authorMatch[1].trim()

  return { title, author }
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[\/，,|]/g)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function extractInternalCozeData(responseData: any) {
  const outer = responseData?.data ?? responseData
  const source = typeof outer?.detailed_plot === 'string' ? outer.detailed_plot : outer?.detailed_plot ?? outer?.detailedPlot ?? outer

  if (typeof source === 'string') {
    try {
      return JSON.parse(source)
    } catch {
      return null
    }
  }

  if (source && typeof source === 'object') return source
  return null
}

function mapCozeToDb(cozeData: any, filename: string) {
  const { title, author } = parseFileInfo(filename)
  const internal = extractInternalCozeData(cozeData)

  const basicInfo = internal?.basic_info ?? internal?.basicInfo ?? {}
  const tagsInfo = internal?.tags_info ?? internal?.tagsInfo ?? {}
  const plotInfo = internal?.plot_info ?? internal?.plotInfo ?? {}
  const plotSlices = Array.isArray(plotInfo?.plot_slices) ? plotInfo.plot_slices : []

  const fallbackText = (value: unknown, defaultValue: string) => {
    if (typeof value !== 'string') return defaultValue
    const text = value.trim()
    return text && text !== '未知' ? text : defaultValue
  }

  return {
    title,
    author,
    finish_status: fallbackText(basicInfo.finish_status, '未知'),
    gender: fallbackText(tagsInfo.category, '未知'),
    male_lead: fallbackText(internal?.male_lead ?? internal?.maleLead ?? basicInfo.male_lead, '未知'),
    female_lead: fallbackText(internal?.female_lead ?? internal?.femaleLead ?? basicInfo.female_lead, '未知'),
    tags: toStringArray(tagsInfo.sub_tags),
    detailed_plot: internal ? JSON.stringify(internal) : JSON.stringify(cozeData),
    source_link: typeof internal?.source_link === 'string' ? internal.source_link.trim() : '',
    male_lead_traits: fallbackText(tagsInfo.male_lead_traits, '未知'),
    female_lead_traits: fallbackText(tagsInfo.female_lead_traits, '未知'),
    plot_summary: Array.isArray(plotSlices) ? plotSlices.flatMap((slice: any) => toStringArray(slice?.plot_summary)) : [],
    highlight_quote: Array.isArray(plotSlices) ? plotSlices.flatMap((slice: any) => toStringArray(slice?.highlight_quote)) : [],
    plot_stage: Array.isArray(plotSlices) ? plotSlices.flatMap((slice: any) => toStringArray(slice?.plot_stage)) : [],
  }
}

async function processBook(filePath: string) {
  const filename = path.basename(filePath)
  const bookText = fs.readFileSync(filePath, 'utf-8')

  try {
    const response = await axios.post(
      process.env.COZE_API_URL!,
      { input_book_text: bookText },
      {
        headers: {
          Authorization: `Bearer ${process.env.COZE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000,
      },
    )

    const mappedData = mapCozeToDb(response.data, filename)

    await prisma.book.upsert({
      where: { title: mappedData.title },
      update: mappedData,
      create: mappedData,
    })

    console.log(`✅ 入库成功: 《${mappedData.title}》`)
  } catch (error: any) {
    console.error(`❌ 处理失败: ${filename}`, error.message)
    fs.appendFileSync('failed_logs.json', JSON.stringify({ title: filename, reason: error.message }) + '\n')
  }
}

async function main() {
  const rawBooksDir = path.join(process.cwd(), 'raw_books')
  if (!fs.existsSync(rawBooksDir)) {
    console.error('未找到 raw_books 文件夹')
    return
  }

  const files = fs.readdirSync(rawBooksDir).filter((f) => f.endsWith('.txt'))
  console.log(`共读取到 ${files.length} 本待处理书籍`)

  const tasks = files.map((file) => {
    const filePath = path.join(rawBooksDir, file)
    return limit(() => processBook(filePath))
  })

  await Promise.all(tasks)
  await prisma.$disconnect()
}

main().catch(async (error) => {
  console.error('批处理脚本执行失败：', error)
  await prisma.$disconnect()
  process.exitCode = 1
})
