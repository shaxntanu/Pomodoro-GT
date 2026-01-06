import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pomodoro Focus - Productivity Timer',
  description: 'A beautiful, minimalist Pomodoro timer to boost your productivity. Track focus sessions, manage tasks, and build better work habits.',
  keywords: ['pomodoro', 'timer', 'productivity', 'focus', 'time management', 'work timer'],
  authors: [{ name: 'Pomodoro Focus' }],
  openGraph: {
    title: 'Pomodoro Focus - Productivity Timer',
    description: 'A beautiful, minimalist Pomodoro timer to boost your productivity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Focus - Productivity Timer',
    description: 'A beautiful, minimalist Pomodoro timer to boost your productivity.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
