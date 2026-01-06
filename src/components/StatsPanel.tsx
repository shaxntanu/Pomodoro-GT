'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Target, CheckCircle, Flame, Trophy } from 'lucide-react'
import { useStore } from '@/store/useStore'

const panelVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 200 },
  },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
}

export function StatsPanel() {
  const { statsPanelOpen, statistics, toggleStatsPanel } = useStore()

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const today = new Date().toISOString().split('T')[0]
  const todayStats = statistics.dailyStats[today] || { focusTime: 0, sessions: 0, tasksCompleted: 0 }

  const weekStats = { focusTime: 0, sessions: 0, tasksCompleted: 0 }
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayStats = statistics.dailyStats[dateStr]
    if (dayStats) {
      weekStats.focusTime += dayStats.focusTime
      weekStats.sessions += dayStats.sessions
      weekStats.tasksCompleted += dayStats.tasksCompleted
    }
  }

  return (
    <AnimatePresence>
      {statsPanelOpen && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full lg:w-auto lg:min-w-[320px] xl:min-w-[420px] overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl text-white">Statistics</h3>
            <motion.button
              onClick={toggleStatsPanel}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close statistics"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Today */}
            <div>
              <h4 className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">Today</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatCard icon={<Clock size={16} />} value={formatTime(todayStats.focusTime)} label="Focus" index={0} />
                <StatCard icon={<Target size={16} />} value={todayStats.sessions.toString()} label="Sessions" index={1} />
                <StatCard icon={<CheckCircle size={16} />} value={todayStats.tasksCompleted.toString()} label="Tasks" index={2} />
              </div>
            </div>

            {/* This Week */}
            <div>
              <h4 className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">This Week</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatCard icon={<Clock size={16} />} value={formatTime(weekStats.focusTime)} label="Focus" index={3} />
                <StatCard icon={<Target size={16} />} value={weekStats.sessions.toString()} label="Sessions" index={4} />
                <StatCard icon={<CheckCircle size={16} />} value={weekStats.tasksCompleted.toString()} label="Tasks" index={5} />
              </div>
            </div>

            {/* All Time */}
            <div>
              <h4 className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">All Time</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <StatCard icon={<Clock size={18} />} value={formatTime(statistics.totalFocusTime)} label="Total Focus" large index={6} />
                <StatCard icon={<Target size={18} />} value={statistics.totalSessions.toString()} label="Sessions" large index={7} />
              </div>
            </div>

            {/* Streaks */}
            <div>
              <h4 className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">Streaks</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <StatCard
                  icon={<Flame size={18} />}
                  value={`${statistics.currentStreak}d`}
                  label="Current"
                  highlight={statistics.currentStreak > 0}
                  index={8}
                />
                <StatCard icon={<Trophy size={18} />} value={`${statistics.longestStreak}d`} label="Best" index={9} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  large?: boolean
  highlight?: boolean
  index: number
}

function StatCard({ icon, value, label, large, highlight, index }: StatCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 ${large ? 'py-3 sm:py-4' : ''} ${
        highlight ? 'border-orange-500/50 bg-orange-500/10' : ''
      }`}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <div className={`flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 ${highlight ? 'text-orange-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      <p className={`text-white font-bold ${large ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'}`}>
        {value}
      </p>
      <p className="text-gray-500 text-[10px] sm:text-xs">{label}</p>
    </motion.div>
  )
}
