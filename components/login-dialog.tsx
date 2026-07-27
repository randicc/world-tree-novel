'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

type LoginDialogProps = {
  onClose: () => void
  onLoginSuccess: () => void
}

export function LoginDialog({ onClose, onLoginSuccess }: LoginDialogProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('请输入邮箱和密码')
      return
    }

    if (password.length < 6) {
      setError('密码至少 6 位')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password,
        })

        if (signInError) throw signInError
      } else {
        const regRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username.trim(), password }),
        })
        const regData = await regRes.json()

        if (!regRes.ok || regData.error) {
          setError(regData.error || '注册失败')
          return
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password,
        })
        if (loginError) {
          setError('注册成功，请登录')
          setMode('login')
          return
        }
      }

      onLoginSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

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
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground transition hover:text-primary" aria-label="关闭">
            <X className="size-5" />
          </button>

          <div className="mb-6 text-center">
            <p className="text-xs tracking-[.35em] text-primary">听风寻叶</p>
            <h2 className="mt-1 font-serif text-xl font-semibold">
              {mode === 'login' ? '叩林 · 登录' : '叩林 · 注册'}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="sr-only">邮箱</label>
              <input
                id="login-email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="邮箱"
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
                placeholder="密码（至少6位）"
                className="w-full rounded-xl border border-dashed border-primary/40 bg-background/60 px-4 py-3 font-serif text-sm outline-none transition focus:border-primary focus:bg-background"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-center text-xs text-destructive">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-center gap-6 text-sm font-serif">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="text-primary transition hover:opacity-70 disabled:opacity-50"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              {loading ? '请稍候...' : (mode === 'login' ? '登录' : '注册')}
            </button>
            <span className="text-primary/30">·</span>
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-muted-foreground transition hover:text-primary"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              {mode === 'login' ? '注册' : '返回登录'}
            </button>
          </div>

          <div className="mt-5 text-center text-[10px] tracking-widest text-muted-foreground/50">
            风会记住每一位旅人的名字
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
