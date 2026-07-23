'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { BookmarkLeaf } from '@/components/bookmark-leaf'
import { PortalButton } from '@/components/portal-button'
import { WhisperText } from '@/components/whisper-text'
import { fetchDeepMatch, type Novel } from '@/lib/novels'

const SCROLL_DURATION = 1.15
const SCROLL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const TEXT_TICK = 20

function EdgeLeaves() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {['7%', '91%'].map((left, index) => (
        <motion.span
          key={left}
          className="absolute top-[-30px] h-5 w-9 rounded-[100%_0_100%_0] border border-primary/30 bg-accent/30"
          style={{ left }}
          animate={{ y: ['0vh', '108vh'], x: [0, index ? -45 : 50, 5], rotate: [0, 130, 260] }}
          transition={{ duration: 17 + index * 3, delay: index * 4, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
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
  const [scrollOpen, setScrollOpen] = useState(false)

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

  useEffect(() => {
    const timer = window.setTimeout(() => setScrollOpen(true), SCROLL_DURATION * 1000 + 80)
    return () => window.clearTimeout(timer)
  }, [])

  async function submitFeedback(helpful: boolean) {
    setFeedback(helpful)
    await onFeedback?.(matchNovel, helpful)
  }

  const whisperActive = scrollOpen && dataReady

  return (
    <main className="deep-match-paper paper-texture relative min-h-svh overflow-hidden bg-background px-3 py-5 text-foreground md:px-8 md:py-10">
      <EdgeLeaves />
      <button
        type="button"
        onClick={onBack}
        className="relative z-20 mx-auto mb-4 flex max-w-5xl items-center gap-2 font-serif text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        返回风送来的故事
      </button>

      <div className="scroll-stage relative mx-auto flex max-w-5xl min-h-[85svh] flex-col overflow-hidden bg-card/90 shadow-2xl">
        <motion.section
          initial={{ scaleY: 0, opacity: 0.35, y: 16 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ duration: SCROLL_DURATION, ease: SCROLL_EASE }}
          style={{ transformOrigin: 'bottom center' }}
          className="echo-note relative mx-4 mt-6 flex min-h-0 flex-[1] flex-col justify-center p-6 text-center shadow-md md:mx-12 md:mt-8 md:p-8"
        >
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 24, opacity: 1 }}
            transition={{ duration: SCROLL_DURATION * 0.7, ease: SCROLL_EASE }}
            className="absolute left-1/2 top-full w-px -translate-x-1/2 overflow-hidden bg-primary/35"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scaleX: 0.55 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: SCROLL_DURATION * 0.5, ease: SCROLL_EASE, delay: 0.05 }}
            className="absolute left-1/2 top-full h-0.5 w-24 -translate-x-1/2 bg-primary/35"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: SCROLL_DURATION * 0.45 }}
            className="absolute inset-x-0 -bottom-4 h-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent"
            aria-hidden="true"
          />
          <span className="pin left-5" aria-hidden="true" />
          <span className="pin right-5" aria-hidden="true" />
          <p className="mb-3 font-serif text-sm italic tracking-widest text-primary">你曾对风说……</p>
          <blockquote className="text-balance font-serif text-xl leading-relaxed text-muted-foreground md:text-3xl">
            “{query || matchNovel.vibe}”
          </blockquote>
        </motion.section>

        <div className="scroll-seam shrink-0" aria-hidden="true" />

        <motion.div
          initial={{ scaleY: 0, opacity: 0.35, y: -16 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ duration: SCROLL_DURATION, ease: SCROLL_EASE, delay: 0.08 }}
          style={{ transformOrigin: 'top center' }}
          className="flex min-h-0 flex-[3] flex-col"
        >
          <section className="journal-lines relative mx-4 flex min-h-0 flex-[2] flex-col px-6 py-8 md:mx-10 md:px-12 md:py-10">
            <BookmarkLeaf onChange={(saved) => onBookmark?.(matchNovel, saved)} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <p className="mb-4 font-serif text-sm tracking-[.25em] text-primary">世界树的回响 · {matchNovel.title}</p>
              <h1 className="mb-6 text-balance font-serif text-2xl md:mb-8 md:text-4xl">风为你找到了这段脉络……</h1>

              {!whisperActive ? (
                <motion.p
                  animate={{ opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="font-serif text-base italic tracking-widest text-muted-foreground md:text-lg"
                >
                  风正在编织脉络……
                </motion.p>
              ) : (
                <WhisperText
                  key={`${matchNovel.id}-${matchNovel.deepMatch}`}
                  text={matchNovel.deepMatch}
                  active={whisperActive}
                  speed={TEXT_TICK}
                  className="deep-story"
                />
              )}
            </div>
          </section>

          <section className="traveler-choice relative flex flex-[1] flex-col justify-end border-t-2 border-dashed border-primary/25 px-4 pb-8 pt-6 md:px-12 md:pb-10">
            <div className="mb-6 min-h-9 text-center md:mb-8">
              <AnimatePresence mode="wait">
                {feedback === null ? (
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-8 md:gap-14"
                  >
                    <button type="button" onClick={() => submitFeedback(true)} className="wave-underline font-serif text-sm">
                      ✓ 符合心声
                    </button>
                    <button type="button" onClick={() => submitFeedback(false)} className="wave-underline font-serif text-sm">
                      ✗ 风吹偏了
                    </button>
                  </motion.div>
                ) : (
                  <motion.p
                    key="thanks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-serif text-sm italic text-primary"
                  >
                    感谢你的低语……
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: scrollOpen ? 1 : 0, y: scrollOpen ? 0 : 16 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
            >
              <p className="mb-4 text-center font-serif text-xs tracking-[.3em] text-muted-foreground">旅人的抉择 · 通往故事所在之处</p>
              <div className="portal-row grid grid-cols-3 [perspective:1000px]">
                <PortalButton title="番茄果园" subtitle="去果香里寻书" mark="●" tone="tomato" href={matchNovel.portals.tomato} className="portal-left" />
                <PortalButton title="晋江花海" subtitle="循花径而往" mark="✦" tone="flower" href={matchNovel.portals.jjwxc} className="portal-center" />
                <PortalButton title="未知秘境" subtitle="等待新的门扉" mark="???" tone="wood" href={matchNovel.portals.mystery} className="portal-right" />
              </div>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </main>
  )
}
