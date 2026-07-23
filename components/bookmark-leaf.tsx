'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type BookmarkLeafProps = {
  initialSaved?: boolean
  onChange?: (saved: boolean) => void | Promise<void>
}

export function BookmarkLeaf({ initialSaved = false, onChange }: BookmarkLeafProps) {
  const [saved, setSaved] = useState(initialSaved)

  async function toggle() {
    const next = !saved
    setSaved(next)
    await onChange?.(next)
  }

  return (
    <div className="absolute -right-1 top-5 z-10 flex items-center gap-2">
      <AnimatePresence>
        {saved && (
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="rounded-full border border-primary/25 bg-card/95 px-3 py-1 font-serif text-xs italic shadow-md">
            已拾叶归册
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ y: 6, rotate: [0, -5, 5, -3, 0] }}
        animate={{ y: saved ? 8 : 0, scale: saved ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 15 }}
        aria-pressed={saved}
        aria-label={saved ? '取消收藏' : '收藏这本书'}
        className="group relative h-20 w-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg viewBox="0 0 60 100" className="h-full w-full drop-shadow-md" aria-hidden="true">
          <path d="M30 96C17 77 4 51 9 27 12 12 23 4 30 3c11 7 22 19 22 37 0 23-11 42-22 56Z" fill={saved ? 'var(--glow)' : 'var(--card)'} fillOpacity={saved ? 1 : .48} stroke={saved ? 'var(--destructive)' : 'var(--muted-foreground)'} strokeWidth="2.5" strokeDasharray={saved ? undefined : '5 4'} />
          <path d="M30 91V14M30 45 16 31M30 62l14-17" fill="none" stroke={saved ? 'var(--destructive)' : 'var(--muted-foreground)'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  )
}
