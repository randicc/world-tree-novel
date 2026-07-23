'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Leaf, LoaderCircle, LogIn, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitBookmark, submitFeedback, type Novel } from '@/lib/novels'
import { NovelResults } from '@/components/novel-results'
import { NovelMatchDetail } from '@/components/novel-match-detail'
import { LeafCollection } from '@/components/leaf-collection'
import { LoginDialog } from '@/components/login-dialog'

const vibes = ['想要一场大雨中的重逢', '带点疯批的救赎之旅', '深夜里温暖的柴火声']

function TwigLogo() {
  return (
    <a href="#" className="group flex items-center gap-3 font-serif text-lg font-semibold tracking-widest" aria-label="听风寻叶首页">
      <span className="relative block h-5 w-10 rotate-[-8deg] border-b-2 border-primary before:absolute before:bottom-0 before:left-3 before:h-3 before:w-2 before:rotate-[-35deg] before:rounded-full before:bg-accent after:absolute after:bottom-0 after:right-1 after:h-3 after:w-2 after:rotate-[35deg] after:rounded-full after:bg-accent" aria-hidden="true" />
      听风寻叶
    </a>
  )
}

export function NovelFinder() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Novel[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null)
  const [showCollection, setShowCollection] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      })
      const payload = (await response.json()) as { status?: string; books?: Novel[] }
      setResults(payload.books ?? [])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleBookmark(novel: Novel, saved: boolean) {
    await submitBookmark({ novelId: novel.id, saved })
  }

  async function handleFeedback(novel: Novel, helpful: boolean) {
    await submitFeedback({ novelId: novel.id, query, helpful })
  }

  if (showCollection) {
    return (
      <LeafCollection
        onBack={() => setShowCollection(false)}
      />
    )
  }
  if (selectedNovel) {
    return (
      <NovelMatchDetail
        query={query}
        novel={selectedNovel}
        onBack={() => setSelectedNovel(null)}
        onBookmark={handleBookmark}
        onFeedback={handleFeedback}
      />
    )
  }

  if (searched) {
    return (
      <NovelResults
        query={query}
        novels={results}
        onBack={() => {
          setSearched(false)
          setResults([])
          setSelectedNovel(null)
        }}
        onMatchNovel={setSelectedNovel}
      />
    )
  }

  return (
    <>
    <main
      className="paper-texture relative min-h-svh overflow-hidden bg-background text-foreground"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(73,59,42,0.22)), url(/shanshui-tree.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-white/4 to-black/25 backdrop-blur-[2px]" aria-hidden="true" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10">
      <TwigLogo />
      <nav className="flex items-center gap-2" aria-label="用户导航">
      <Button variant="ghost" onClick={() => setShowCollection(true)} className="leaf-nav h-10 rounded-full border border-white/25 bg-white/10 px-4 font-normal text-primary shadow-sm backdrop-blur-md hover:bg-white/20">
      <BookOpen data-icon="inline-start" />拾叶
      </Button>
      <Button variant="ghost" onClick={() => setShowLogin(true)} className="leaf-nav h-10 rounded-full border border-white/25 bg-white/10 px-4 font-normal text-primary shadow-sm backdrop-blur-md hover:bg-white/20">
      <LogIn data-icon="inline-start" />叩林
      </Button>
    </nav>
  </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] max-w-3xl flex-col items-center px-5 pb-16 pt-14 text-center md:pt-20">
        <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-white/8 px-5 py-4 backdrop-blur-[1.5px] md:px-8">
          <p className="font-serif text-sm tracking-[0.4em] text-primary/80">寻叶 · 找书</p>
          <h1 className="text-balance font-serif text-4xl font-medium tracking-[0.28em] text-primary text-shadow-gold md:text-6xl" style={{ fontFamily: '"Songti SC", "SimSun", "Noto Serif SC", serif' }}>听 风 于 世 界 树 下</h1>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground/80 md:text-base" style={{ textShadow: '0 1px 8px rgba(255,255,255,0.3)' }}>把模糊的心事交给风，让它循着枝桠，为你找到那一页恰好的故事。</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 w-full md:mt-12">
          <div className="scroll-input group flex items-center gap-3 rounded-[24px] border border-white/40 bg-white/18 p-2 pl-5 shadow-lg backdrop-blur-md transition-all focus-within:border-primary/60 focus-within:bg-white/24 focus-within:shadow-xl md:pl-7">
            <Search className="hidden size-5 shrink-0 text-primary/65 sm:block" aria-hidden="true" />
            <label htmlFor="novel-query" className="sr-only">描述你想寻找的故事</label>
            <input id="novel-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="告诉风你想做怎样的梦，它会为你吹落那片故事……" className="min-w-0 flex-1 bg-transparent py-4 text-base italic text-foreground outline-none placeholder:text-foreground/45 md:text-lg" style={{ fontFamily: '"Songti SC", "SimSun", "Noto Serif SC", serif' }} />
            <motion.div whileHover={{ rotate: [0, -3] }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
              <Button type="submit" disabled={loading} className="h-12 rounded-full border border-white/35 bg-[color:var(--secondary)] px-5 text-secondary-foreground shadow-md shadow-black/10 hover:bg-[color:color-mix(in_srgb,var(--secondary)_90%,white)] md:h-14 md:px-7">
                {loading ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <Leaf data-icon="inline-start" />}
                寻叶
              </Button>
            </motion.div>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="情绪快捷入口">
          {vibes.map((vibe) => (
            <button key={vibe} type="button" onClick={() => setQuery(vibe)} className="rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {vibe}
            </button>
          ))}
        </div>

        <footer className="mt-auto pt-20 text-xs tracking-widest text-foreground/80 md:pt-24">
          <p style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 10px rgba(73,59,42,0.35)' }}>每一本书，都是世界树上飘落的一页。</p>
          <p className="mt-2 opacity-75" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.35)' }}>© 2026 听风寻叶</p>
        </footer>
      </section>
    </main>
    {showLogin && <LoginDialog onClose={() => setShowLogin(false)} />}
    </>
  )
}
