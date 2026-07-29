import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import './globals.css'

const sans = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-body' })
const serif = Noto_Serif_SC({ subsets: ['latin'], variable: '--font-story' })

export const metadata: Metadata = {
  title: "听风寻叶",
  description: "把模糊的心事交给风，让它为你找到那一页恰好的故事",
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#eee3c5',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
