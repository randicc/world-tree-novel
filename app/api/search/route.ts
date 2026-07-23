import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { Novel } from '@/lib/novels'

const prisma = new PrismaClient()

// ====== 解析 Coze 返回的意图 ======
function extractIntent(data: any) {
  if (data.search_intent) return data
  if (data.data?.search_intent) return data.data
  if (typeof data.data === 'string') {
    try { return JSON.parse(data.data) } catch {}
    const match = data.data.match(/\{[\s\S]*\}/)
    if (match) try { return JSON.parse(match[0]) } catch {}
  }
  return null
}

// ====== 根据 tags 推算封面类型 ======
function mapCover(tags: string[]): 'rain' | 'forest' | 'fire' {
  const fireWords = ['悬疑', '刑侦', '复仇', '虐恋', '黑暗', '强强', '博弈']
  const rainWords = ['甜宠', '治愈', '温馨', '先婚后爱', '青梅竹马', '暗恋', '日常']

  if (tags.some(t => fireWords.some(k => t.includes(k)))) return 'fire'
  if (tags.some(t => rainWords.some(k => t.includes(k)))) return 'rain'
  return 'forest'
}

// ====== 数据库数据 → 前端 Novel 格式 ======
function mapBookToNovel(book: any, intentType: 'A' | 'B'): Novel {
  // 解析 detailed_plot JSON
  let plotData: any = null
  try {
    plotData = typeof book.detailed_plot === 'string'
      ? JSON.parse(book.detailed_plot)
      : book.detailed_plot
  } catch {}

  const plotSlices = plotData?.plot_info?.plot_slices ?? []

  // summary：取第一个 plot_slice 的摘要，兜底用 plot_summary 数组
  const summary = plotSlices[0]?.plot_summary
    ?? (book.plot_summary?.slice(0, 2).join('') ?? '')
  
  // review：取一个 highlight_quote，兜底取 plot_slice 里的
  const review = book.highlight_quote?.[0]
    ?? plotSlices[0]?.highlight_quote
    ?? ''
  
  // vibe：用前两个标签组合
  const vibe = book.tags?.slice(0, 2).join(' · ') ?? ''
  
  // deepMatch：拼接所有 plot_slice 的摘要，形成完整剧情描述
  const deepMatch = plotSlices.length > 0
    ? plotSlices.map((s: any, i: number) => {
        const stage = s.plot_stage ?? ''
        const text = s.plot_summary ?? ''
        return stage ? `【${stage}】${text}` : text
      }).join('\n\n')
    : (book.plot_summary?.join('\n\n') ?? book.detailed_plot ?? '')

  // match：A类精准搜索匹配度高，B类剧情搜索稍低
  const match = intentType === 'A' ? 92 : 88

  // cover：根据标签推断
  const cover = mapCover(book.tags ?? [])

  // portals：用 source_link 作为 tomato 链接
  const portals = {
    tomato: book.source_link || undefined,
    jjwxc: undefined,
    mystery: undefined,
  }

  return {
    id: String(book.id),
    title: book.title,
    author: book.author ?? '未知',
    vibe,
    match,
    summary,
    review,
    cover,
    deepMatch,
    portals,
  }
}

// ====== 搜索接口主逻辑 ======
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  // 前端发的是 { prompt: query }，兼容多种 key
  const searchInput = body?.prompt || body?.searchInput || body?.query || ''

  if (!searchInput) {
    return NextResponse.json({ status: 'error', books: [] })
  }

  try {
    // 第一步：调 Coze 识别意图
    const cozeRes = await fetch(process.env.COZE_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_TOKEN!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_query: searchInput }),
    })

    const cozeData = await cozeRes.json()
    const intent = extractIntent(cozeData)

    if (!intent || !intent.search_intent) {
      return NextResponse.json({ status: 'error', books: [], message: '意图识别失败' })
    }

    // 第二步：根据意图查 Supabase
    const query = intent.search_query
    const intentType = intent.search_intent as 'A' | 'B'
    let dbBooks: any[] = []

    if (intentType === 'A') {
      dbBooks = await prisma.$queryRaw`
        SELECT * FROM search_books_exact(${query})
      ` as any[]
    } else if (intentType === 'B') {
      dbBooks = await prisma.$queryRaw`
        SELECT * FROM search_books_by_plot(${query})
      ` as any[]
    }

    // 第三步：转换成前端 Novel 格式
    const books: Novel[] = dbBooks.map(b => mapBookToNovel(b, intentType))

    // 第四步：返回结果
    return NextResponse.json({
      status: 'success',
      books: books,
    })

  } catch (error) {
    console.error('搜索出错:', error)
    return NextResponse.json({ status: 'error', books: [] })
  }
}