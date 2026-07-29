'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BookmarkLeaf } from '@/components/bookmark-leaf'
import { PortalButton } from '@/components/portal-button'
import { fetchDeepMatch, type Novel } from '@/lib/novels'

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return <span>{displayed}</span>
}

type NovelMatchDetailProps = {
  query: string
  novel: Novel
  onBack: () => void
  onBookmark?: (novel: Novel, saved: boolean) => void | Promise<void>
  onFeedback?: (novel: Novel, helpful: boolean) => void | Promise<void>
}

export function NovelMatchDetail({ query, novel, onBack, onBookmark, onFeedback }: NovelMatchDetailProps) {
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [matchNovel, setMatchNovel] = useState<Novel>(novel)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadDeepMatch() {
      setDataReady(false)
      const result = await fetchDeepMatch({ query, novelId: novel.id })
      if (cancelled) return
      if (result) setMatchNovel(result)
      setDataReady(true)
    }

    loadDeepMatch()
    return () => {
      cancelled = true
    }
  }, [query, novel.id])

  async function submitFeedback(helpful: boolean) {
    setFeedback(helpful)
    await onFeedback?.(matchNovel, helpful)
  }

  return (
    <main className="deep-match-paper paper-texture relative min-h-screen overflow-hidden bg-background px-3 py-5 text-foreground md:px-8 md:py-10">
      <button
        type="button"
        onClick={onBack}
        className="relative z-20 mx-auto mb-4 flex max-w-5xl items-center gap-2 font-serif text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        返回风送来的故事
      </button>

      <div className="scroll-stage relative mx-auto flex min-h-screen max-w-5xl flex-col overflow-y-auto bg-card/90 shadow-2xl">
        <section className="echo-note relative mx-4 mt-6 flex flex-none flex-col justify-center py-4 text-center shadow-md md:mx-12 md:mt-8 md:py-5">
          <span className="pin left-5" aria-hidden="true" />
          <span className="pin right-5" aria-hidden="true" />
          <p className="mb-3 font-serif text-sm italic tracking-widest text-primary">你曾对风说……</p>
          <blockquote className="text-balance font-serif text-xl leading-relaxed text-muted-foreground md:text-3xl">
            “{query || matchNovel.vibe}”
          </blockquote>
        </section>

        <div className="scroll-seam shrink-0" aria-hidden="true" />

        <div className="flex min-h-0 flex-[3] flex-col">
          <section className="journal-lines relative mx-4 flex min-h-0 flex-[2] flex-col px-6 py-8 md:mx-10 md:px-12 md:py-10">
            <BookmarkLeaf onChange={(saved) => onBookmark?.(matchNovel, saved)} />
            <div className="overflow-visible">
              <p className="mb-4 font-serif text-sm tracking-[.25em] text-primary">世界树的回响 · {matchNovel.title}</p>
              <h1 className="mb-6 text-balance font-serif text-2xl md:mb-8 md:text-4xl">风为你找到了这段脉络……</h1>

              {!dataReady ? (
                <p className="font-serif text-base italic tracking-widest text-muted-foreground md:text-lg">风正在编织脉络……</p>
              ) : (
                <p className="deep-story font-serif text-base leading-8 text-foreground md:text-lg md:leading-9">
                  <TypewriterText key={`${matchNovel.id}-${matchNovel.deepMatch}`} text={matchNovel.deepMatch} />
                </p>
              )}
            </div>
          </section>

          <section className="traveler-choice relative flex flex-none flex-col justify-end border-t-2 border-dashed border-primary/25 px-4 pb-3 pt-3 md:px-12 md:pb-4">
            <div className="mb-3 min-h-9 text-center md:mb-3">
              {feedback === null ? (
                <div className="flex items-center justify-center gap-8 md:gap-14">
                  <button type="button" onClick={() => submitFeedback(true)} className="wave-underline font-serif text-sm">
                    ✓ 符合心声
                  </button>
                  <button type="button" onClick={() => submitFeedback(false)} className="wave-underline font-serif text-sm">
                    ✗ 风吹偏了
                  </button>
                </div>
              ) : (
                <p className="font-serif text-sm italic text-primary">感谢你的低语……</p>
              )}
            </div>

            <div>
              <p className="mb-4 text-center font-serif text-xs tracking-[.3em] text-muted-foreground">旅人的抉择 · 通往故事所在之处</p>
              <div className="portal-row grid grid-cols-3 [perspective:1000px]">
                <PortalButton title="番茄果园" subtitle="去果香里寻书" mark="●" tone="tomato" href={matchNovel.portals.tomato} className="portal-left" />
                <PortalButton title="晋江花海" subtitle="循花径而往" mark="✦" tone="flower" href={matchNovel.portals.jjwxc} className="portal-center" />
                <PortalButton title="未知秘境" subtitle="等待新的门扉" mark="???" tone="wood" href={matchNovel.portals.mystery} className="portal-right" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
