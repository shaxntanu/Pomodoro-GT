'use client'

import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, ListTodo, BarChart3, SkipForward } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { TimerStatus } from '@/types'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
}

export function Controls({ status, onStart, onPause, onReset, onSkip }: ControlsProps) {
  const {
    settingsPanelOpen,
    tasksPanelOpen,
    statsPanelOpen,
    toggleSettingsPanel,
    toggleTasksPanel,
    toggleStatsPanel,
  } = useStore()

  const isRunning = status === 'running'
  const isCountdown = status === 'countdown'

  const buttonBase = "font-mono text-xs sm:text-sm md:text-base lg:text-lg bg-transparent border-2 border-gray-500 text-gray-400 px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px]"
  const activeButton = "border-white text-white bg-white/20"
  const panelActiveButton = "border-white text-white bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.3)]"

  const iconSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 18

  return (
    <motion.div
      className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 justify-center mt-3 sm:mt-4 md:mt-6 lg:mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {isRunning || isCountdown ? (
        <motion.button
          onClick={onPause}
          className={`${buttonBase} ${activeButton}`}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          aria-label="Pause timer"
        >
          <Pause size={iconSize} />
          <span className="hidden xs:inline sm:inline">PAUSE</span>
        </motion.button>
      ) : (
        <motion.button
          onClick={onStart}
          className={buttonBase}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          aria-label="Start timer"
        >
          <Play size={iconSize} />
          <span className="hidden xs:inline sm:inline">START</span>
        </motion.button>
      )}

      <motion.button
        onClick={onReset}
        className={buttonBase}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Reset timer"
      >
        <RotateCcw size={iconSize} />
        <span className="hidden sm:inline">RESET</span>
      </motion.button>

      <motion.button
        onClick={onSkip}
        className={buttonBase}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Skip to next session"
      >
        <SkipForward size={iconSize} />
        <span className="hidden sm:inline">SKIP</span>
      </motion.button>

      <motion.button
        onClick={toggleSettingsPanel}
        className={`${buttonBase} ${settingsPanelOpen ? panelActiveButton : ''}`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Open settings"
      >
        <Settings size={iconSize} />
        <span className="hidden md:inline">SETTINGS</span>
      </motion.button>

      <motion.button
        onClick={toggleTasksPanel}
        className={`${buttonBase} ${tasksPanelOpen ? panelActiveButton : ''}`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Open tasks"
      >
        <ListTodo size={iconSize} />
        <span className="hidden md:inline">TASKS</span>
      </motion.button>

      <motion.button
        onClick={toggleStatsPanel}
        className={`${buttonBase} ${statsPanelOpen ? panelActiveButton : ''}`}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Open statistics"
      >
        <BarChart3 size={iconSize} />
        <span className="hidden md:inline">STATS</span>
      </motion.button>
    </motion.div>
  )
}
