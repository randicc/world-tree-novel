'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, BookMarked, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
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
  const books = placeholderBooks
  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(books.length / pageSize))
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  const pageBooks = useMemo(() => books.slice(page * pageSize, (page + 1) * pageSize), [books, page])
  const slots = useMemo(() => Array.from({ length: pageSize }, (_, index) => pageBooks[index] ?? null), [pageBooks])

  function goToPage(nextPage: number) {
    if (nextPage < 0 || nextPage >= totalPages) return
    setDirection(nextPage > page ? 1 : -1)
    setPage(nextPage)
  }

  return (
    <main className="paper-texture relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      <header className="border-b border-primary/25 bg-card/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button onClick={onBack} className="flex min-w-0 items-center gap-3 text-left">
            <ArrowLeft className="size-5 text-primary" />
            <TreeMark />
            <span className="min-w-0 font-serif text-base font-semibold tracking-wide sm:text-xl">听风寻叶 · 拾叶</span>
          </button>
          <BookMarked className="size-5 text-primary/60" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-4 md:px-8 md:py-5">
        <div className="shrink-0 text-center">
          <p className="text-xs tracking-[.35em] text-primary">你拾起的每一片叶</p>
          <h1 className="mt-1 font-serif text-2xl md:text-[2.15rem]">藏在枝桠间的书签</h1>
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/45 bg-secondary/55 px-4 py-2 text-sm text-primary shadow-sm transition hover:bg-secondary/75 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            上一页
          </button>
          <span className="font-serif text-sm tracking-widest text-primary/80">
            {page + 1}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages - 1}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/45 bg-secondary/55 px-4 py-2 text-sm text-primary shadow-sm transition hover:bg-secondary/75 disabled:pointer-events-none disabled:opacity-40"
          >
            下一页
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 items-stretch justify-center pb-1">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="grid h-full w-full max-w-6xl grid-cols-3 gap-3 md:gap-4"
            >
              {slots.map((book, index) =>
                book ? (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group flex min-h-0 flex-col overflow-hidden rounded-xl border border-primary/30 bg-card shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[3/4] max-h-[18vh] overflow-hidden border-b border-primary/20 bg-secondary/40 md:max-h-[20vh]">
                      <MiniCover type={book.cover} />
                    </div>
                    <div className="flex flex-1 min-h-0 flex-col justify-center gap-0.5 px-2 py-1.5 text-center md:px-3 md:py-2">
                      <h3 className="font-serif text-sm font-semibold leading-tight">{book.title}</h3>
                      <p className="text-xs italic text-muted-foreground">{book.author}</p>
                      <p className="text-[10px] tracking-wider text-primary/60">{book.vibe}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${page}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-card shadow-md"
                  >
                    <Plus className="size-8 text-primary/55 md:size-10" />
                  </motion.div>
                ),
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
