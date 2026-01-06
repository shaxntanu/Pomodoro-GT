'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { playNotificationSound } from '@/lib/audio'
import type { TimerSettings, AudioSettings } from '@/types'

const panelVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 200 },
  },
  exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.2 } },
}

export function SettingsPanel() {
  const {
    settingsPanelOpen,
    timerSettings,
    audioSettings,
    status,
    setTimerSettings,
    setAudioSettings,
    toggleSettingsPanel,
    resetTimer,
  } = useStore()

  const [localTimer, setLocalTimer] = useState<TimerSettings>(timerSettings)
  const [localAudio, setLocalAudio] = useState<AudioSettings>(audioSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setLocalTimer(timerSettings)
    setLocalAudio(audioSettings)
    setHasChanges(false)
  }, [timerSettings, audioSettings, settingsPanelOpen])

  const handleTimerChange = (key: keyof TimerSettings, value: number | boolean) => {
    setLocalTimer(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleAudioChange = (key: keyof AudioSettings, value: string | number | boolean) => {
    setLocalAudio(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (status === 'running') {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    setTimerSettings(localTimer)
    setAudioSettings(localAudio)
    resetTimer()
    setHasChanges(false)
  }

  const previewSound = () => {
    playNotificationSound(localAudio.notificationSound, localAudio.volume / 100)
  }

  return (
    <AnimatePresence>
      {settingsPanelOpen && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full lg:w-auto lg:min-w-[320px] xl:min-w-[380px] overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl text-white">Settings</h3>
            <div className="flex gap-2">
              <AnimatePresence>
                {hasChanges && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={handleSave}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-gray-500 text-gray-400 rounded-lg hover:border-white hover:text-white transition-all"
                  >
                    SAVE
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button
                onClick={toggleSettingsPanel}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close settings"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-red-400 text-center text-xs sm:text-sm"
              >
                Pause the timer before changing settings
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-white mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Timer</h4>
              <div className="space-y-2 sm:space-y-3">
                <SettingRow label="Focus (min)">
                  <input
                    type="number"
                    value={localTimer.focusTime}
                    onChange={e => handleTimerChange('focusTime', Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-14 sm:w-16 md:w-20 bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-center text-sm sm:text-base"
                    min={1}
                    max={60}
                  />
                </SettingRow>
                <SettingRow label="Short Break">
                  <input
                    type="number"
                    value={localTimer.shortBreak}
                    onChange={e => handleTimerChange('shortBreak', Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                    className="w-14 sm:w-16 md:w-20 bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-center text-sm sm:text-base"
                    min={1}
                    max={30}
                  />
                </SettingRow>
                <SettingRow label="Long Break">
                  <input
                    type="number"
                    value={localTimer.longBreak}
                    onChange={e => handleTimerChange('longBreak', Math.max(5, Math.min(60, parseInt(e.target.value) || 5)))}
                    className="w-14 sm:w-16 md:w-20 bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-center text-sm sm:text-base"
                    min={5}
                    max={60}
                  />
                </SettingRow>
                <SettingRow label="Sessions">
                  <input
                    type="number"
                    value={localTimer.totalSessions}
                    onChange={e => handleTimerChange('totalSessions', Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                    className="w-14 sm:w-16 md:w-20 bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-center text-sm sm:text-base"
                    min={1}
                    max={12}
                  />
                </SettingRow>
                <SettingRow label="Long Break After">
                  <input
                    type="number"
                    value={localTimer.sessionsUntilLongBreak}
                    onChange={e => handleTimerChange('sessionsUntilLongBreak', Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
                    className="w-14 sm:w-16 md:w-20 bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-center text-sm sm:text-base"
                    min={2}
                    max={8}
                  />
                </SettingRow>
                <SettingRow label="Auto Breaks">
                  <Toggle
                    checked={localTimer.autoStartBreaks}
                    onChange={v => handleTimerChange('autoStartBreaks', v)}
                  />
                </SettingRow>
                <SettingRow label="Auto Focus">
                  <Toggle
                    checked={localTimer.autoStartPomodoros}
                    onChange={v => handleTimerChange('autoStartPomodoros', v)}
                  />
                </SettingRow>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Audio</h4>
              <div className="space-y-2 sm:space-y-3">
                <SettingRow label="Sound">
                  <div className="flex gap-1 sm:gap-2">
                    <select
                      value={localAudio.notificationSound}
                      onChange={e => handleAudioChange('notificationSound', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm"
                    >
                      <option value="bell">Bell</option>
                      <option value="chime">Chime</option>
                      <option value="ding">Ding</option>
                      <option value="beep">Beep</option>
                      <option value="none">None</option>
                    </select>
                    <motion.button
                      onClick={previewSound}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Preview sound"
                    >
                      <Volume2 size={16} />
                    </motion.button>
                  </div>
                </SettingRow>
                <SettingRow label="Volume">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="range"
                      value={localAudio.volume}
                      onChange={e => handleAudioChange('volume', parseInt(e.target.value))}
                      className="w-16 sm:w-20 md:w-24 accent-white"
                      min={0}
                      max={100}
                    />
                    <span className="text-white w-6 sm:w-8 text-right text-xs sm:text-sm">{localAudio.volume}</span>
                  </div>
                </SettingRow>
                <SettingRow label="Ticking">
                  <Toggle
                    checked={localAudio.tickingSound}
                    onChange={v => handleAudioChange('tickingSound', v)}
                  />
                </SettingRow>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-gray-400 text-xs sm:text-sm md:text-base gap-2">
      <span className="truncate">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-white' : 'bg-white/20'
      }`}
      role="switch"
      aria-checked={checked}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full ${checked ? 'bg-black' : 'bg-white/50'}`}
        animate={{ x: checked ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 22 : 26) : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}
