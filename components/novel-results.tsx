'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookMarked, Leaf, MessageCircle, Search, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyForest } from '@/components/empty-forest'
import { submitWish, type Novel } from '@/lib/novels'

type NovelResultsProps = { query: string; novels: Novel[]; onBack: () => void; onMatchNovel: (novel: Novel) => void }

const leaves = [{ left: '8%', delay: 0 }, { left: '67%', delay: 3.4 }, { left: '88%', delay: 6.8 }]

function TreeMark() {
  return <span className="relative block size-10 rounded-full border-2 border-primary/50 bg-secondary/60 before:absolute before:bottom-1 before:left-1/2 before:h-6 before:w-0.5 before:-translate-x-1/2 before:bg-primary after:absolute after:left-2 after:top-2 after:size-5 after:rounded-[55%_45%_50%_50%] after:bg-accent" aria-hidden="true" />
}

function StoryCover({ type }: { type: Novel['cover'] }) {
  const colors = type === 'rain' ? ['var(--stream)', 'var(--primary)'] : type === 'fire' ? ['var(--glow)', 'var(--door)'] : ['var(--secondary)', 'var(--primary)']
  return (
    <svg viewBox="0 0 240 290" className="h-full w-full" role="img" aria-label="手绘小说封面">
      <rect x="7" y="7" width="226" height="276" rx="4" fill={colors[0]} stroke="var(--tree-ink)" strokeWidth="4" strokeDasharray="9 4" />
      <circle cx="170" cy="75" r="35" fill="var(--card)" opacity=".7" />
      <path d="M18 228 C65 190 89 220 128 179 C171 136 197 180 225 151 V274 H18Z" fill={colors[1]} opacity=".78" />
      <path d="M26 241 C69 211 105 230 138 194 C172 157 201 188 220 170" fill="none" stroke="var(--card)" strokeWidth="3" strokeLinecap="round" />
      {type === 'rain' && <g stroke="var(--card)" strokeWidth="2" opacity=".75">{[40,70,104,139,190].map((x) => <path key={x} d={`M${x} 40l-18 70`} />)}</g>}
      {type === 'forest' && <path d="M70 220l34-115 25 68 22-103 38 150" fill="none" stroke="var(--tree-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />}
      {type === 'fire' && <path d="M102 215c-34-34 9-52 18-91 39 37 49 65 19 91-10 9-27 9-37 0Z" fill="var(--glow)" stroke="var(--tree-ink)" strokeWidth="3" />}
    </svg>
  )
}

function FlippingNovel({ novel }: { novel: Novel }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="story-perspective w-full max-w-xs justify-self-center lg:max-w-none">
      <motion.button type="button" onClick={() => setFlipped((value) => !value)} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 95, damping: 16 }} className="story-card relative block aspect-[4/5.8] w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" aria-label={`${novel.title}，点击${flipped ? '查看封面' : '翻转阅读书评'}`}>
        <article className="sketch-card story-face absolute inset-0 flex flex-col bg-card p-3 shadow-xl">
          <span className="match-seal absolute right-0 top-2 z-10 flex size-20 rotate-6 items-center justify-center rounded-full border-2 border-dashed border-destructive bg-card/90 px-2 text-center font-serif text-xs font-bold text-destructive shadow-md">匹配度<br />{novel.match}%</span>
          <div className="min-h-0 flex-1 overflow-hidden border-2 border-primary/40 bg-secondary"><StoryCover type={novel.cover} /></div>
          <div className="flex flex-col gap-1 px-2 pb-1 pt-3 text-center"><h2 className="text-balance font-serif text-xl font-semibold">{novel.title}</h2><p className="text-sm italic text-muted-foreground">作者 · {novel.author}</p></div>
        </article>
        <article className="sketch-card story-face story-back absolute inset-0 flex items-center justify-center bg-secondary p-7 text-center shadow-xl">
          <div className="flex flex-col gap-4"><Leaf className="mx-auto size-7 text-destructive" aria-hidden="true" /><p className="font-serif text-xl leading-relaxed text-destructive">“{novel.review}”</p><p className="text-xs tracking-widest text-muted-foreground">风的私语 · 再点一次返回</p></div>
        </article>
      </motion.button>
    </div>
  )
}

function FloatingLeaves() {
  return <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">{leaves.map((leaf, index) => <motion.span key={index} className="absolute top-[-40px] block h-5 w-8 rounded-[100%_0_100%_0] border border-primary/30 bg-accent/35" style={{ left: leaf.left }} animate={{ y: ['0vh', '110vh'], x: [0, index % 2 ? -90 : 120, 20], rotate: [0, 130, 290] }} transition={{ duration: 13 + index * 2, delay: leaf.delay, repeat: Infinity, ease: 'linear' }} />)}</div>
}

export function NovelResults({ query, novels, onBack, onMatchNovel }: NovelResultsProps) {
  const [windOpen, setWindOpen] = useState(false)
  if (novels.length === 0) {
    return (
      <div className="results-paper paper-texture min-h-svh">
        <EmptyForest onBack={onBack} onPlantWish={() => submitWish({ query })} />
      </div>
    )
  }

  return (
    <main className="results-paper paper-texture relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <FloatingLeaves />
      <header className="sticky top-0 z-30 border-b border-primary/25 bg-card/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button onClick={onBack} className="flex min-w-0 items-center gap-3 text-left"><TreeMark /><span className="min-w-0 font-serif text-base font-semibold tracking-wide sm:text-xl">风送来了这些故事</span></button>
          <nav className="flex shrink-0 items-center gap-1" aria-label="结果页导航">
            <Button variant="ghost" className="leaf-cursor rounded-full px-3"><BookMarked data-icon="inline-start" /><span className="hidden sm:inline">拾叶</span></Button>
            <Button variant="ghost" onClick={() => setWindOpen((value) => !value)} aria-expanded={windOpen} className="rounded-full px-3"><Wind data-icon="inline-start" /><span className="hidden sm:inline">听风</span></Button>
          </nav>
        </div>
        <motion.div initial={false} animate={{ height: windOpen ? 'auto' : 0, opacity: windOpen ? 1 : 0 }} className="overflow-hidden">
          <div className="wind-input mx-auto flex max-w-xl items-center gap-2 px-4 pb-4">
            <MessageCircle className="size-4 text-primary" aria-hidden="true" /><label htmlFor="wind-discussion" className="sr-only">在讨论广场留下话语</label><input id="wind-discussion" placeholder="把读后心绪写进风里……" className="w-full rounded-full border border-dashed border-primary/50 bg-background/70 px-4 py-2 text-sm outline-none focus:border-primary" />
          </div>
        </motion.div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
        <div className="mb-12 flex flex-col gap-2 text-center"><p className="text-xs tracking-[.35em] text-primary">听风寻书 · {novels.length} 片落叶</p><h1 className="text-balance font-serif text-3xl md:text-5xl">“{query || '随风而来的故事'}”</h1><p className="text-sm text-muted-foreground">轻触左侧书页，听听风藏在背后的真话</p></div>
        <div className="flex flex-col gap-20 md:gap-28">
          {novels.map((novel, index) => (
            <section key={novel.id} className="grid items-center gap-7 md:grid-cols-[minmax(220px,30%)_1fr] md:gap-12" aria-label={`${novel.title}搜索结果`}>
              <motion.div initial={{ opacity: 0, y: 48, rotate: -1 }} whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: 'easeOut' }}><FlippingNovel novel={novel} /></motion.div>
              <motion.article initial={{ opacity: 0, y: 55, x: 12 }} whileInView={{ opacity: 1, y: 0, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .75, delay: .14, ease: 'easeOut' }} className="letter-paper relative p-7 shadow-xl md:p-10">
                <Search className="mb-5 size-5 text-primary/60" aria-hidden="true" /><p className="mb-3 font-serif text-sm tracking-[.25em] text-primary">剧情脉络 · {novel.vibe}</p><p className="font-serif text-lg leading-[2] text-foreground md:text-xl">{novel.summary}</p><div className="mt-7 flex flex-wrap items-center justify-between gap-4 text-xs italic text-muted-foreground"><span className="min-w-28 flex-1 border-t border-primary/25 pt-2">风在这里认出了你的低语</span><button type="button" onClick={() => onMatchNovel(novel)} className="vine-button rounded-full border border-dashed border-primary/45 bg-secondary/55 px-5 py-2 font-serif not-italic text-primary transition hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">匹配剧情 →</button></div>
              </motion.article>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
