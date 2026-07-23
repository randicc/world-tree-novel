import { NextResponse } from 'next/server'
import type { Novel } from '@/lib/novels'

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
  let plotData: any = null
  try {
    plotData = typeof book.detailed_plot === 'string'
      ? JSON.parse(book.detailed_plot) : book.detailed_plot
  } catch {}

  const plotSlices = plotData?.plot_info?.plot_slices ?? []
  const summary = plotSlices[0]?.plot_summary ?? (book.plot_summary?.slice(0, 2).join('') ?? '')
  const review = book.highlight_quote?.[0] ?? plotSlices[0]?.highlight_quote ?? ''
  const vibe = book.tags?.slice(0, 2).join(' · ') ?? ''
  const deepMatch = plotSlices.length > 0
    ? plotSlices.map((s: any) => s.plot_stage ? `【${s.plot_stage}】${s.plot_summary}` : s.plot_summary).join('\n\n')
    : (book.plot_summary?.join('\n\n') ?? book.detailed_plot ?? '')
  const match = intentType === 'A' ? 92 : 88
  const cover = mapCover(book.tags ?? [])
  const portals = { tomato: book.source_link || undefined, jjwxc: undefined, mystery: undefined }

  return { id: String(book.id), title: book.title, author: book.author ?? '未知', vibe, match, summary, review, cover, deepMatch, portals }
}

// ====== 调用 Supabase REST API（替代 Prisma） ======
async function callSupabaseRPC(funcName: string, args: Record<string, string>) {
  const res = await fetch(`${process.env.SUPABASE_URL!}/rest/v1/rpc/${funcName}`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase RPC error: ${text}`)
  }
  return res.json()
}

// ====== 搜索接口主逻辑 ======
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
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

    // 第二步：根据意图调 Supabase RPC
    const query = intent.search_query
    const intentType = intent.search_intent as 'A' | 'B'

    const dbBooks = intentType === 'A'
      ? await callSupabaseRPC('search_books_exact', { search_text: query })
      : await callSupabaseRPC('search_books_by_plot', { search_text: query })

    // 第三步：转换成前端 Novel 格式
    const books: Novel[] = (dbBooks ?? []).map((b: any) => mapBookToNovel(b, intentType))

    return NextResponse.json({ status: 'success', books: books })
  } catch (error) {
    console.error('搜索出错:', error)
    return NextResponse.json({ status: 'error', books: [] })
  }
}