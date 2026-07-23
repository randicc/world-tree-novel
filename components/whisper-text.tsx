'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type WhisperTextProps = {
  text: string
  active?: boolean
  speed?: number
  className?: string
  onComplete?: () => void
}

export function WhisperText({ text, active = true, speed = 28, className, onComplete }: WhisperTextProps) {
  const [length, setLength] = useState(0)
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!active) {
      setLength(0)
      setDone(false)
      return
    }

    setLength(0)
    setDone(false)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setLength(index)
      if (index >= text.length) {
        window.clearInterval(timer)
        setDone(true)
        onCompleteRef.current?.()
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, active, speed])

  const visible = text.slice(0, length)
  const paragraphs = visible.split('\n\n').filter(Boolean)

  return (
    <div className={className} aria-live="polite">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 12)}`}
          className={`mb-6 font-serif text-lg leading-[2.05] text-foreground md:text-xl ${index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:text-primary' : ''}`}
        >
          {paragraph}
          {!done && index === paragraphs.length - 1 && (
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-primary/55"
            />
          )}
        </p>
      ))}
    </div>
  )
}
