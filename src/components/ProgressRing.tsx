'use client'

import { useStore } from '@/store/useStore'
import { useMemo } from 'react'

interface ProgressRingProps {
  timeLeft: number
}

export function ProgressRing({ timeLeft }: ProgressRingProps) {
  const { mode, timerSettings, currentSession } = useStore()

  const totalTime = useMemo(() => {
    switch (mode) {
      case 'focus':
        return timerSettings.focusTime * 60
      case 'shortBreak':
        return timerSettings.shortBreak * 60
      case 'longBreak':
        return timerSettings.longBreak * 60
    }
  }, [mode, timerSettings])

  const progress = ((totalTime - timeLeft) / totalTime) * 100
  const displaySession = Math.ceil(currentSession / 2)

  // SVG-based ring for better mobile performance
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-[min(55vw,180px)] sm:w-[min(45vw,220px)] md:w-[min(40vw,260px)] lg:w-[min(35vw,300px)] xl:w-[320px] 2xl:w-[380px] aspect-square mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex-shrink-0 progress-ring-enter">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#333333"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-300 ease-linear"
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
        <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Session</span>
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
          {displaySession}/{timerSettings.totalSessions}
        </span>
      </div>
    </div>
  )
}
