'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Quote } from './Quote'
import { ProgressRing } from './ProgressRing'
import { TimerDisplay } from './TimerDisplay'
import { Controls } from './Controls'
import { SettingsPanel } from './SettingsPanel'
import { TasksPanel } from './TasksPanel'
import { StatsPanel } from './StatsPanel'
import { Notification, useNotification } from './Notification'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function PomodoroTimer() {
  const {
    initializeFromStorage,
    closeAllPanels,
    toggleSettingsPanel,
    toggleTasksPanel,
    settingsPanelOpen,
    tasksPanelOpen,
    statsPanelOpen,
  } = useStore()
  const { timeLeft, status, mode, countdownValue, start, pause, reset, skip } = useTimer()
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    const modeLabel = mode === 'focus' ? '🍅' : '☕'
    document.title = `${formatTime(timeLeft)} ${modeLabel} Pomodoro Focus`
    return () => { document.title = 'Pomodoro Focus' }
  }, [timeLeft, mode])

  useEffect(() => {
    if (status === 'idle' && timeLeft === 0) {
      showNotification(mode === 'focus' ? 'Focus session completed!' : 'Break completed!')
    }
  }, [status, timeLeft, mode, showNotification])

  const handleSpace = useCallback(() => {
    if (status === 'running' || status === 'countdown') {
      pause()
    } else {
      start()
    }
  }, [status, start, pause])

  useKeyboardShortcuts({
    onSpace: handleSpace,
    onEscape: closeAllPanels,
    onR: reset,
    onS: toggleSettingsPanel,
    onT: toggleTasksPanel,
  })

  const anyPanelOpen = settingsPanelOpen || tasksPanelOpen || statsPanelOpen

  return (
    <motion.div
      className="relative z-10 w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 flex flex-col items-center safe-area-inset landscape-compact"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white mb-2 sm:mb-4 lg:mb-6 text-center tracking-wider"
        style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
      >
        POMODORO FOCUS
      </motion.h1>

      <motion.div variants={itemVariants}>
        <Quote />
      </motion.div>

      {/* Main Timer Container */}
      <motion.div
        variants={itemVariants}
        className="bg-white/[0.02] border border-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 backdrop-blur-lg w-full"
        whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
        transition={{ duration: 0.3 }}
      >
        <ProgressRing timeLeft={timeLeft} />
        <TimerDisplay
          timeLeft={timeLeft}
          status={status}
          mode={mode}
          countdownValue={countdownValue}
        />
        <Controls
          status={status}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSkip={skip}
        />
      </motion.div>

      {/* Panels Container */}
      <AnimatePresence mode="wait">
        {anyPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 sm:mt-6 lg:mt-8 w-full flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-stretch"
          >
            <SettingsPanel />
            <TasksPanel />
            <StatsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts hint - hidden on mobile */}
      <motion.div
        variants={itemVariants}
        className="mt-6 sm:mt-8 text-gray-600 text-[10px] sm:text-xs lg:text-sm text-center hidden sm:block"
      >
        Shortcuts: Space (start/pause) • R (reset) • S (settings) • T (tasks) • Esc (close)
      </motion.div>

      <Notification
        message={notification.message}
        show={notification.show}
        onHide={hideNotification}
      />
    </motion.div>
  )
}
