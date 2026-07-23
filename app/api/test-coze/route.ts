import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 测试1：Coze
    const cozeRes = await fetch(process.env.COZE_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_TOKEN!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_query: '池中物' }),
    })
    const cozeData = await cozeRes.json()

    // 测试2：Supabase
    const supabaseRes = await fetch(`${process.env.SUPABASE_URL!}/rest/v1/rpc/search_books_exact`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search_text: '池中物' }),
    })
    const supabaseData = await supabaseRes.json()

    return NextResponse.json({
      coze_result: cozeData,
      supabase_result: supabaseData,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) })
  }
}