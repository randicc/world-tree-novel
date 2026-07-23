'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BookMarked } from 'lucide-react'
import type { Novel } from '@/lib/novels'

// 9本占位书数据
const placeholderBooks: Novel[] = [
  { id: '1', title: '雨停之前拥抱我', author: '林迟', vibe: '大雨中的重逢', match: 98, cover: 'rain', summary: '阔别七年，他们在南方一座终日落雨的小城重逢。', review: '前三章安静得像雨前的窗。', deepMatch: '', portals: {} },
  { id: '2', title: '月亮坠入旧森林', author: '闻野', vibe: '疯批救赎', match: 95, cover: 'forest', summary: '守林人捡到一位从月光里跌落的逃亡者。', review: '两位主角都不太正常，偏偏凑在一起治好了读者。', deepMatch: '', portals: {} },
  { id: '3', title: '壁炉边的第七封信', author: '南枝', vibe: '深夜暖意', match: 92, cover: 'fire', summary: '冬日旅店每逢深夜便会多出一封没有署名的信。', review: '一把钝刀温柔地割开你最硬的心。', deepMatch: '', portals: {} },
  { id: '4', title: '池中物', author: '久七悖论', vibe: '豪门 · 青梅竹马', match: 90, cover: 'fire', summary: '沈意与林越洲从婚约僵持到彼此坦诚。', review: '越洲哥哥，我是你的谁呀？', deepMatch: '', portals: {} },
  { id: '5', title: '风中的信', author: '远山', vibe: '治愈 · 日常', match: 88, cover: 'rain', summary: '一封寄错地址的信，串起两个陌生人的冬天。', review: '读完想给远方的人写封信。', deepMatch: '', portals: {} },
  { id: '6', title: '银色苔藓', author: '枝上', vibe: '悬疑 · 强强', match: 86, cover: 'fire', summary: '废墟中长出的银色苔藓藏着被遗忘的真相。', review: '每一页都在翻转你对角色的判断。', deepMatch: '', portals: {} },
  { id: '7', title: '落叶归途', author: '白鹭', vibe: '归来 · 温馨', match: 85, cover: 'forest', summary: '离家十年的人踩着落叶回到故乡小镇。', review: '不是大故事，却是让人安心的小故事。', deepMatch: '', portals: {} },
  { id: '8', title: '旧书店的猫', author: '旧窗', vibe: '日常 · 治愈', match: 84, cover: 'rain', summary: '一只猫守着一间旧书店，也守着一段沉默的爱情。', review: '猫比人更懂得等待。', deepMatch: '', portals: {} },
  { id: '9', title: '雪中灯火', author: '半盏', vibe: '寒冬 · 暖意', match: 83, cover: 'forest', summary: '大雪封山那夜，远处亮起一盏不肯熄灭的灯。', review: '灯不是给路人照的，是给自己留的。', deepMatch: '', portals: {} },
]

// 简化版书封面（适配九宫格小卡片）
function MiniCover({ type }: { type: Novel['cover'] }) {
  const fills = type === 'rain' ? 'var(--stream)' : type === 'fire' ? 'var(--glow)' : 'var(--secondary)'
  const detail = type === 'rain' ? 'var(--primary)' : type === 'fire' ? 'var(--door)' : 'var(--accent)'
  return (
    <svg viewBox="0 0 120 140" className="h-full w-full" role="img" aria-label="书封面">
      <rect x="4" y="4" width="112" height="132" rx="3" fill={fills} stroke="var(--tree-ink)" strokeWidth="2.5" strokeDasharray="6 3" />
      <path d="M12 108 C30 86 42 96 56 82 C68 68 78 90 108 74 V132 H12Z" fill={detail} opacity=".65" />
      <circle cx="80" cy="30" r="14" fill="var(--card)" opacity=".5" />
    </svg>
  )
}

function TreeMark() {
  return <span className="relative block size-8 rounded-full border-2 border-primary/50 bg-secondary/60 before:absolute before:bottom-0.5 before:left-1/2 before:h-4 before:w-0.5 before:-translate-x-1/2 before:bg-primary after:absolute after:left-1 after:top-1 after:size-4 after:rounded-[55%_45%_50%_50%] after:bg-accent" aria-hidden="true" />
}

type LeafCollectionProps = {
  onBack: () => void
}

export function LeafCollection({ onBack }: LeafCollectionProps) {
  const books = placeholderBooks // 后续改为从收藏 API 获取

  return (
    <main className="paper-texture relative min-h-svh overflow-x-hidden bg-background text-foreground">
      {/* 头部 */}
      <header className="sticky top-0 z-30 border-b border-primary/25 bg-card/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button onClick={onBack} className="flex min-w-0 items-center gap-3 text-left">
            <ArrowLeft className="size-5 text-primary" />
            <TreeMark />
            <span className="min-w-0 font-serif text-base font-semibold tracking-wide sm:text-xl">听风寻叶 · 拾叶</span>
          </button>
          <BookMarked className="size-5 text-primary/60" aria-hidden="true" />
        </div>
      </header>

      {/* 页面标题 */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-4 text-center md:px-8 md:pt-16">
        <p className="text-xs tracking-[.35em] text-primary">你拾起的每一片叶</p>
        <h1 className="mt-2 font-serif text-2xl md:text-4xl">藏在枝桠间的书签</h1>
      </div>

      {/* 九宫格 */}
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-primary/30 bg-card shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* 封面 */}
              <div className="aspect-[3/4] border-b border-primary/20 bg-secondary/40 overflow-hidden">
                <MiniCover type={book.cover} />
              </div>
              {/* 信息 */}
              <div className="flex flex-col gap-0.5 px-3 py-2 text-center">
                <h3 className="font-serif text-sm font-semibold leading-tight md:text-base">{book.title}</h3>
                <p className="text-xs italic text-muted-foreground">{book.author}</p>
                <p className="text-[10px] tracking-wider text-primary/60">{book.vibe}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="pb-8 text-center text-xs tracking-widest text-foreground/60">
        <p>每一本书，都是世界树上飘落的一页。</p>
      </footer>
    </main>
  )
}