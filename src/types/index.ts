export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedPomodoros: number
}

export interface TimerSettings {
  focusTime: number
  shortBreak: number
  longBreak: number
  totalSessions: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
}

export interface AudioSettings {
  notificationSound: 'bell' | 'chime' | 'ding' | 'beep' | 'none'
  volume: number
  tickingSound: boolean
}

export interface Statistics {
  totalFocusTime: number
  totalSessions: number
  completedTasks: number
  dailyStats: Record<string, DailyStats>
}

export interface DailyStats {
  focusTime: number
  sessions: number
  tasksCompleted: number
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'countdown'
