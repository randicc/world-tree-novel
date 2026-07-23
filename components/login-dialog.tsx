'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type LoginDialogProps = {
  onClose: () => void
}

export function LoginDialog({ onClose }: LoginDialogProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-2xl border border-primary/30 bg-card p-8 shadow-xl backdrop-blur-md"
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground transition hover:text-primary"
            aria-label="关闭"
          >
            <X className="size-5" />
          </button>

          {/* 标题 */}
          <div className="mb-6 text-center">
            <p className="text-xs tracking-[.35em] text-primary">听风寻叶</p>
            <h2 className="mt-1 font-serif text-xl font-semibold">
              {mode === 'login' ? '叩林 · 登录' : '叩林 · 注册'}
            </h2>
          </div>

          {/* 输入框 */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-username" className="sr-only">用户名</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                className="w-full rounded-xl border border-dashed border-primary/40 bg-background/60 px-4 py-3 font-serif text-sm outline-none transition focus:border-primary focus:bg-background"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="sr-only">密码</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full rounded-xl border border-dashed border-primary/40 bg-background/60 px-4 py-3 font-serif text-sm outline-none transition focus:border-primary focus:bg-background"
              />
            </div>
          </div>

          {/* 登录 / 注册按钮（无边框） */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm font-serif">
            <button
              type="button"
              onClick={() => {
                // 登录逻辑 — 后续接入 Supabase Auth
                console.log('登录:', { username, password })
              }}
              className="text-primary transition hover:opacity-70"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              登录
            </button>
            <span className="text-primary/30">·</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-muted-foreground transition hover:text-primary"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              {mode === 'login' ? '注册' : '返回登录'}
            </button>
          </div>

          {/* 底部装饰 */}
          <div className="mt-5 text-center text-[10px] tracking-widest text-muted-foreground/50">
            风会记住每一片叶的名字
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}