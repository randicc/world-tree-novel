'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type EmptyForestProps = {
  onBack: () => void
  onPlantWish?: () => void | Promise<void>
}

export function EmptyForest({ onBack, onPlantWish }: EmptyForestProps) {
  const [planted, setPlanted] = useState(false)
  const [planting, setPlanting] = useState(false)

  async function handlePlantWish() {
    if (planted || planting) return
    setPlanting(true)
    await onPlantWish?.()
    setPlanted(true)
    setPlanting(false)
  }

  return (
    <main
      className="empty-forest-paper paper-texture relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-24 text-center"
      style={{
        backgroundImage: 'url(/shanshui-tree.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/18 via-white/6 to-black/12" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#e8dcc8]/8 backdrop-blur-[1px]" aria-hidden="true" />

      <section className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-6" aria-labelledby="empty-title">
        <div className="relative mx-auto my-6 flex w-full justify-center px-2">
          <div className="frayed-edge-container relative w-full max-w-[32rem]">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#b8d4e3]/20 via-transparent to-[#4a7c5f]/15" />

            <AnimatePresence mode="wait">
              {!planted ? (
                <motion.img
                  key="ku"
                  src="/ku.png"
                  alt="风穿过枝桠"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="mx-auto block w-full rounded-lg object-cover"
                />
              ) : (
                <motion.img
                  key="zhongshu"
                  src="/zhongshu.png"
                  alt="种下的树"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="mx-auto block w-full rounded-lg object-cover"
                />
              )}
            </AnimatePresence>

            <svg className="absolute inset-0 z-20 h-full w-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none">
              <path d="M0,0 L20,8 L40,3 L60,10 L80,5 L100,12 L120,2 L140,9 L160,4 L180,11 L200,6 L220,13 L240,3 L260,10 L280,5 L300,8 L320,4 L340,9 L360,6 L380,11 L400,0 Z" fill="var(--background)" opacity="0.85" />
              <path d="M0,500 L25,492 L50,497 L75,490 L100,495 L125,488 L150,493 L175,489 L200,494 L225,487 L250,492 L275,496 L300,489 L325,493 L350,491 L375,496 L400,500 Z" fill="var(--background)" opacity="0.85" />
              <path d="M0,0 L8,20 L3,40 L10,60 L5,80 L12,100 L4,120 L9,140 L6,160 L11,180 L3,200 L8,220 L5,240 L10,260 L4,280 L9,300 L6,320 L11,340 L3,360 L8,380 L5,400 L10,420 L4,440 L9,460 L6,480 L0,500 Z" fill="var(--background)" opacity="0.7" />
              <path d="M400,0 L392,20 L397,40 L390,60 L395,80 L388,100 L396,120 L391,140 L394,160 L389,180 L397,200 L392,220 L395,240 L390,260 L396,280 L391,300 L394,320 L389,340 L397,360 L392,380 L395,400 L390,420 L396,440 L391,460 L394,480 L400,500 Z" fill="var(--background)" opacity="0.7" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <h1
            id="empty-title"
            className="text-balance font-serif text-3xl tracking-wide text-[#fffaf0] md:text-4xl"
            style={{ textShadow: '0 0 10px rgba(255,200,100,0.6), 0 0 25px rgba(255,200,100,0.3), 0 0 45px rgba(255,180,80,0.15), 1px 1px 2px rgba(73,59,42,0.9)' }}
          >
            风穿过枝桠，却未落下叶子
          </h1>
          <p
            className="font-serif text-base leading-relaxed text-[#fffdf6]"
            style={{ textShadow: '0 0 6px rgba(255,200,100,0.4), 0 0 15px rgba(255,200,100,0.2), 1px 1px 1px rgba(73,59,42,0.7)' }}
          >
            世界树的藏书阁里，暂时还没有这般脉络的故事……
          </p>
          <p
            className="text-sm leading-relaxed text-[#f8efd9]"
            style={{ textShadow: '0 0 4px rgba(255,200,100,0.3), 0 0 10px rgba(255,200,100,0.15)' }}
          >
            但风记住了你的低语，也许等种子发芽时，它就会出现。
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="vine-return-btn font-serif text-sm text-[#fffaf0] md:text-base"
            style={{ textShadow: '0 0 4px rgba(255,200,100,0.25)' }}
          >
            🔙 改写一阵风（重新搜索）
          </button>

          <button
            type="button"
            onClick={handlePlantWish}
            disabled={planted || planting}
            className="wish-link font-serif text-sm text-[#fffaf0] disabled:cursor-default disabled:opacity-80"
            style={{ textShadow: '0 0 4px rgba(255,200,100,0.25)' }}
          >
            <AnimatePresence mode="wait">
              {!planted ? (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="underline decoration-dashed underline-offset-4"
                >
                  种下一颗种子
                </motion.span>
              ) : planting ? (
                <motion.span
                  key="planting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="italic"
                >
                  种子正在落入泥土……
                </motion.span>
              ) : (
                <motion.span
                  key="planted"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="italic"
                >
                  心愿已经埋进树根
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </section>
    </main>
  )
}
