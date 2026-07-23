export type Novel = {
  id: string
  title: string
  author: string
  vibe: string
  match: number
  summary: string
  review: string
  cover: 'rain' | 'forest' | 'fire'
  deepMatch: string
  portals: {
    tomato?: string
    jjwxc?: string
    mystery?: string
  }
}

export type DeepMatchRequest = { query: string; novelId: string }

export type BookmarkRequest = { novelId: string; saved: boolean }

export type FeedbackRequest = { novelId: string; query: string; helpful: boolean }

const mockNovels: Novel[] = [
  { id: '1', title: '雨停之前拥抱我', author: '林迟', vibe: '大雨中的重逢', match: 98, cover: 'rain', summary: '阔别七年，他们在南方一座终日落雨的小城重逢。她借住在即将拆除的旧书店，他则带着一封始终没有寄出的信。雨水漫过青石巷，也一点点冲开那些被误解封存的往事。', review: '前三章安静得像雨前的窗，第十章却会让你在凌晨三点突然坐起。', deepMatch: '故事从一场没有尽头的梅雨开始。旧书店的屋檐滴着水，她在整理遗落的书页时，看见七年前不告而别的人站在门外。\n\n他们没有立刻相认，只隔着雨声交换一本又一本旧书。直到那封从未寄出的信被风吹开，所有错过才终于有了名字。你所期待的重逢并非轻易和解，而是两个走过漫长孤独的人，学会在同一把伞下重新相信彼此。', portals: { tomato: '#tomato', jjwxc: '#jjwxc', mystery: '#mystery' } },
  { id: '2', title: '月亮坠入旧森林', author: '闻野', vibe: '疯批救赎', match: 95, cover: 'forest', summary: '被王国遗忘的守林人捡到一位从月光里跌落的逃亡者。一个不相信善意，一个从不懂得退让；他们在长满银色苔藓的废墟中互相试探，也把彼此从漫长的黑夜里拽了出来。', review: '两位主角都不太正常，偏偏凑在一起，治好了读者。', deepMatch: '月光坠落的那一夜，守林人在禁区捡到浑身是血的逃亡者。两个人都把温柔藏在锋利的言语后面，却一次次替对方挡住森林深处的恶意。\n\n这不是谁单方面拯救谁的故事。他们像两株向黑暗生长的藤蔓，彼此纠缠、彼此刺伤，最终也借着对方的方向触到天光。', portals: { tomato: '#tomato', jjwxc: '#jjwxc', mystery: '#mystery' } },
  { id: '3', title: '壁炉边的第七封信', author: '南枝', vibe: '深夜暖意', match: 92, cover: 'fire', summary: '冬日旅店每逢深夜便会多出一封没有署名的信。年轻的店主循着壁炉边的微光，为陌生人补完迟到多年的告别，也终于读到了那封专门留给自己的第七封信。', review: '没有惊天反转，只有一把钝刀，温柔地割开你最硬的心。', deepMatch: '大雪封住山路后，旅店里只剩壁炉噼啪作响。每到午夜，门缝下便会出现一封陌生人的信，写着来不及说出口的告别。\n\n年轻店主循着信里的线索，为六位旅人找回遗失的心意。当第七封信出现，他才发现这场漫长而温暖的传递，也是在引领自己与往事和解。', portals: { tomato: '#tomato', jjwxc: '#jjwxc', mystery: '#mystery' } },
]

export type WishRequest = { query: string }

const WISH_ENDPOINT = '/api/wishes'
const SEARCH_ENDPOINT = '/api/search'
const COZE_MATCH_ENDPOINT = '/api/coze/match'
const BOOKMARK_ENDPOINT = '/api/bookmarks'
const FEEDBACK_ENDPOINT = '/api/feedback'

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

/** 深度匹配 — 接入 Coze 时打开 USE_COZE_API，由 Route Handler 安全调用 workflow。 */
export async function fetchDeepMatch({ query, novelId }: DeepMatchRequest): Promise<Novel | null> {
  const USE_COZE_API = false

  if (USE_COZE_API) {
    return postJson<Novel>(COZE_MATCH_ENDPOINT, { query, novelId })
  }

  await new Promise((resolve) => setTimeout(resolve, 350))
  return mockNovels.find((novel) => novel.id === novelId) ?? null
}

/** 小说搜索 — 接入后端 API。 */
export async function fetchNovels(query: string): Promise<Novel[]> {
  const response = await postJson<{ status: string; books: Novel[] }>(SEARCH_ENDPOINT, { prompt: query })
  return response.books
}

/** 拾叶收藏 — 预留后端持久化接口。 */
export async function submitBookmark({ novelId, saved }: BookmarkRequest): Promise<void> {
  const USE_BACKEND = false

  if (USE_BACKEND) {
    await postJson<{ ok: true }>(BOOKMARK_ENDPOINT, { novelId, saved })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 120))
}

/** 空结果「种下心愿」— 预留后端记录接口。 */
export async function submitWish({ query }: WishRequest): Promise<void> {
  const USE_BACKEND = false

  if (USE_BACKEND) {
    await postJson<{ ok: true }>(WISH_ENDPOINT, { query })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 180))
}

/** 匹配反馈 — 预留后端上报接口。 */
export async function submitFeedback({ novelId, query, helpful }: FeedbackRequest): Promise<void> {
  const USE_BACKEND = false

  if (USE_BACKEND) {
    await postJson<{ ok: true }>(FEEDBACK_ENDPOINT, { novelId, query, helpful })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 120))
}
