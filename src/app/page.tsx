'use client'

import { motion } from 'framer-motion'
import { StarBackground } from '@/components/StarBackground'
import { FullscreenButton } from '@/components/FullscreenButton'
import { PomodoroTimer } from '@/components/PomodoroTimer'

export default function Home() {
  return (
    <motion.main
      className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <StarBackground />
      <FullscreenButton />
      <PomodoroTimer />
    </motion.main>
  )
}
