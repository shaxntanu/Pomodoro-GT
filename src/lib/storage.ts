import type { Task, TimerSettings, AudioSettings, Statistics } from '@/types'

const STORAGE_KEYS = {
  TASKS: 'pomodoro_tasks',
  TIMER_SETTINGS: 'pomodoro_timer_settings',
  AUDIO_SETTINGS: 'pomodoro_audio_settings',
  STATISTICS: 'pomodoro_statistics',
  QUOTE_INDEX: 'pomodoro_quote_index',
} as const

export const defaultTimerSettings: TimerSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  totalSessions: 4,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
}

export const defaultAudioSettings: AudioSettings = {
  notificationSound: 'bell',
  volume: 50,
  tickingSound: false,
}

export const defaultStatistics: Statistics = {
  totalFocusTime: 0,
  totalSessions: 0,
  completedTasks: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  dailyStats: {},
}

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function safeSetItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const storage = {
  getTasks: (): Task[] => safeGetItem(STORAGE_KEYS.TASKS, []),
  setTasks: (tasks: Task[]) => safeSetItem(STORAGE_KEYS.TASKS, tasks),
  
  getTimerSettings: (): TimerSettings => safeGetItem(STORAGE_KEYS.TIMER_SETTINGS, defaultTimerSettings),
  setTimerSettings: (settings: TimerSettings) => safeSetItem(STORAGE_KEYS.TIMER_SETTINGS, settings),
  
  getAudioSettings: (): AudioSettings => safeGetItem(STORAGE_KEYS.AUDIO_SETTINGS, defaultAudioSettings),
  setAudioSettings: (settings: AudioSettings) => safeSetItem(STORAGE_KEYS.AUDIO_SETTINGS, settings),
  
  getStatistics: (): Statistics => safeGetItem(STORAGE_KEYS.STATISTICS, defaultStatistics),
  setStatistics: (stats: Statistics) => safeSetItem(STORAGE_KEYS.STATISTICS, stats),
  
  getQuoteIndex: (): number => safeGetItem(STORAGE_KEYS.QUOTE_INDEX, 0),
  setQuoteIndex: (index: number) => safeSetItem(STORAGE_KEYS.QUOTE_INDEX, index),
}
