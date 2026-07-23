'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export type PortalTone = 'tomato' | 'flower' | 'wood'

export type PortalButtonProps = {
  title: string
  subtitle: string
  mark: string
  href?: string
  tone: PortalTone
  onClick?: () => void
  className?: string
}

export function PortalButton({ title, subtitle, mark, href, tone, onClick, className }: PortalButtonProps) {
  const plankClass = `portal-plank portal-${tone} group flex min-h-32 flex-col items-center justify-center gap-2 px-2 py-5 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:min-h-40 ${className ?? ''}`
  const content = (
    <>
      <span className="font-serif text-base font-bold md:text-xl">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
      <span className="font-serif text-lg opacity-65">{mark}</span>
      {href && <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden="true" />}
    </>
  )

  const motionProps = {
    whileHover: { scale: 1.035, rotateX: -5 },
    transition: { type: 'spring' as const, stiffness: 240, damping: 16 },
  }

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} {...motionProps} className={plankClass}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps} className={plankClass}>
      {content}
    </motion.button>
  )
}
