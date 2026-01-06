'use client'

import { create } from 'zustand'
import type { Task, TimerSettings, AudioSettings, Statistics, TimerMode, TimerStatus } from '@/types'
import { storage, defaultTimerSettings, defaultAudioSettings, defaultStatistics } from '@/lib/storage'

interface TimerState {
  timeLeft: number
  mode: TimerMode
  status: TimerStatus
  currentSession: number
  countdownValue: number
  
  timerSettings: TimerSettings
  audioSettings: AudioSettings
  statistics: Statistics
  tasks: Task[]
  
  settingsPanelOpen: boolean
  tasksPanelOpen: boolean
  statsPanelOpen: boolean
  
  setTimeLeft: (time: number) => void
  setMode: (mode: TimerMode) => void
  setStatus: (status: TimerStatus) => void
  setCurrentSession: (session: number) => void
  setCountdownValue: (value: number) => void
  
  setTimerSettings: (settings: TimerSettings) => void
  setAudioSettings: (settings: AudioSettings) => void
  updateStatistics: (updates: Partial<Statistics>) => void
  
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  incrementTaskPomodoro: (id: string) => void
  
  toggleSettingsPanel: () => void
  toggleTasksPanel: () => void
  toggleStatsPanel: () => void
  closeAllPanels: () => void
  
  initializeFromStorage: () => void
  resetTimer: () => void
  completeSession: () => void
}

export const useStore = create<TimerState>((set, get) => ({
  timeLeft: 25 * 60,
  mode: 'focus',
  status: 'idle',
  currentSession: 1,
  countdownValue: 0,
  
  timerSettings: defaultTimerSettings,
  audioSettings: defaultAudioSettings,
  statistics: defaultStatistics,
  tasks: [],
  
  settingsPanelOpen: false,
  tasksPanelOpen: false,
  statsPanelOpen: false,
  
  setTimeLeft: (time) => set({ timeLeft: time }),
  setMode: (mode) => set({ mode }),
  setStatus: (status) => set({ status }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setCountdownValue: (value) => set({ countdownValue: value }),
  
  setTimerSettings: (settings) => {
    storage.setTimerSettings(settings)
    set({ timerSettings: settings })
  },
  
  setAudioSettings: (settings) => {
    storage.setAudioSettings(settings)
    set({ audioSettings: settings })
  },
  
  updateStatistics: (updates) => {
    const current = get().statistics
    const newStats = { ...current, ...updates }
    storage.setStatistics(newStats)
    set({ statistics: newStats })
  },
  
  addTask: (text) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      completedPomodoros: 0,
    }
    const tasks = [...get().tasks, newTask]
    storage.setTasks(tasks)
    set({ tasks })
  },
  
  toggleTask: (id) => {
    const tasks = get().tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed
        if (completed) {
          const stats = get().statistics
          const today = new Date().toISOString().split('T')[0]
          const dailyStats = stats.dailyStats[today] || { focusTime: 0, sessions: 0, tasksCompleted: 0 }
          get().updateStatistics({
            completedTasks: stats.completedTasks + 1,
            dailyStats: {
              ...stats.dailyStats,
              [today]: { ...dailyStats, tasksCompleted: dailyStats.tasksCompleted + 1 }
            }
          })
        }
        return { ...task, completed }
      }
      return task
    })
    storage.setTasks(tasks)
    set({ tasks })
  },
  
  deleteTask: (id) => {
    const tasks = get().tasks.filter(task => task.id !== id)
    storage.setTasks(tasks)
    set({ tasks })
  },
  
  incrementTaskPomodoro: (id) => {
    const tasks = get().tasks.map(task =>
      task.id === id ? { ...task, completedPomodoros: task.completedPomodoros + 1 } : task
    )
    storage.setTasks(tasks)
    set({ tasks })
  },
  
  toggleSettingsPanel: () => set(state => ({
    settingsPanelOpen: !state.settingsPanelOpen,
    tasksPanelOpen: false,
    statsPanelOpen: false,
  })),
  
  toggleTasksPanel: () => set(state => ({
    tasksPanelOpen: !state.tasksPanelOpen,
    settingsPanelOpen: false,
    statsPanelOpen: false,
  })),
  
  toggleStatsPanel: () => set(state => ({
    statsPanelOpen: !state.statsPanelOpen,
    settingsPanelOpen: false,
    tasksPanelOpen: false,
  })),
  
  closeAllPanels: () => set({
    settingsPanelOpen: false,
    tasksPanelOpen: false,
    statsPanelOpen: false,
  }),
  
  initializeFromStorage: () => {
    const timerSettings = storage.getTimerSettings()
    const audioSettings = storage.getAudioSettings()
    const statistics = storage.getStatistics()
    const tasks = storage.getTasks()
    
    set({
      timerSettings,
      audioSettings,
      statistics,
      tasks,
      timeLeft: timerSettings.focusTime * 60,
    })
  },
  
  resetTimer: () => {
    const { mode, timerSettings } = get()
    let time: number
    
    switch (mode) {
      case 'focus':
        time = timerSettings.focusTime * 60
        break
      case 'shortBreak':
        time = timerSettings.shortBreak * 60
        break
      case 'longBreak':
        time = timerSettings.longBreak * 60
        break
    }
    
    set({ timeLeft: time, status: 'idle' })
  },
  
  completeSession: () => {
    const { mode, currentSession, timerSettings, statistics } = get()
    const today = new Date().toISOString().split('T')[0]
    const dailyStats = statistics.dailyStats[today] || { focusTime: 0, sessions: 0, tasksCompleted: 0 }
    
    if (mode === 'focus') {
      const isLongBreak = currentSession % timerSettings.sessionsUntilLongBreak === 0
      const newMode = isLongBreak ? 'longBreak' : 'shortBreak'
      const newTime = isLongBreak ? timerSettings.longBreak * 60 : timerSettings.shortBreak * 60
      
      // Update streak
      let newStreak = statistics.currentStreak
      const lastDate = statistics.lastSessionDate
      if (lastDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        newStreak = lastDate === yesterdayStr ? statistics.currentStreak + 1 : 1
      }
      
      get().updateStatistics({
        totalFocusTime: statistics.totalFocusTime + timerSettings.focusTime,
        totalSessions: statistics.totalSessions + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(statistics.longestStreak, newStreak),
        lastSessionDate: today,
        dailyStats: {
          ...statistics.dailyStats,
          [today]: {
            ...dailyStats,
            focusTime: dailyStats.focusTime + timerSettings.focusTime,
            sessions: dailyStats.sessions + 1,
          }
        }
      })
      
      set({
        mode: newMode,
        timeLeft: newTime,
        currentSession: currentSession + 1,
        status: timerSettings.autoStartBreaks ? 'running' : 'idle',
      })
    } else {
      set({
        mode: 'focus',
        timeLeft: timerSettings.focusTime * 60,
        status: timerSettings.autoStartPomodoros ? 'running' : 'idle',
      })
    }
  },
}))
