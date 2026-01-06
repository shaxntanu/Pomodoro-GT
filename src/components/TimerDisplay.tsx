'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { TimerStatus, TimerMode } from '@/types'

interface TimerDisplayProps {
  timeLeft: number
  status: TimerStatus
  mode: TimerMode
  countdownValue: number
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getModeLabel(mode: TimerMode): string {
  switch (mode) {
    case 'focus':
      return 'FOCUS TIME'
    case 'shortBreak':
      return 'SHORT BREAK'
    case 'longBreak':
      return 'LONG BREAK'
  }
}

export function TimerDisplay({ timeLeft, status, mode, countdownValue }: TimerDisplayProps) {
  const isRunning = status === 'running'
  const isCountdown = status === 'countdown'

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {isCountdown ? (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold text-white"
            style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.8)' }}
          >
            {countdownValue || 'GO!'}
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white tabular-nums"
            style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mt-1 sm:mt-2 md:mt-3 lg:mt-4 ${
          isRunning ? 'text-white animate-glow' : 'text-gray-400'
        }`}
        animate={isRunning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
        transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
      >
        {getModeLabel(mode)}
      </motion.div>
    </div>
  )
}
