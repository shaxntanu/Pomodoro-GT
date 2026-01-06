'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { playNotificationSound, playCountdownBeep, playTickSound } from '@/lib/audio'

export function useTimer() {
  const {
    timeLeft,
    status,
    mode,
    timerSettings,
    audioSettings,
    countdownValue,
    setTimeLeft,
    setStatus,
    setCountdownValue,
    completeSession,
    resetTimer,
  } = useStore()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  
  const clearAllIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
      countdownRef.current = null
    }
  }, [])
  
  const startCountdown = useCallback(() => {
    setStatus('countdown')
    setCountdownValue(3)
    
    let count = 3
    const tick = () => {
      if (count > 0) {
        playCountdownBeep(audioSettings.volume / 100)
        count--
        setCountdownValue(count)
        countdownRef.current = setTimeout(tick, 1000)
      } else {
        setStatus('running')
      }
    }
    
    playCountdownBeep(audioSettings.volume / 100)
    countdownRef.current = setTimeout(tick, 1000)
  }, [audioSettings.volume, setStatus, setCountdownValue])
  
  const start = useCallback(() => {
    if (status === 'idle' || status === 'paused') {
      startCountdown()
    }
  }, [status, startCountdown])
  
  const pause = useCallback(() => {
    clearAllIntervals()
    if (status === 'running') {
      setStatus('paused')
    } else if (status === 'countdown') {
      setStatus('idle')
      setCountdownValue(0)
    }
  }, [status, clearAllIntervals, setStatus, setCountdownValue])
  
  const reset = useCallback(() => {
    clearAllIntervals()
    resetTimer()
  }, [clearAllIntervals, resetTimer])
  
  const skip = useCallback(() => {
    clearAllIntervals()
    completeSession()
  }, [clearAllIntervals, completeSession])
  
  // Main timer effect
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft - 1)
        
        if (audioSettings.tickingSound && mode === 'focus') {
          playTickSound(audioSettings.volume / 100)
        }
      }, 1000)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, timeLeft, mode, audioSettings, setTimeLeft])
  
  // Session completion effect
  useEffect(() => {
    if (timeLeft <= 0 && status === 'running') {
      clearAllIntervals()
      playNotificationSound(audioSettings.notificationSound, audioSettings.volume / 100)
      completeSession()
    }
  }, [timeLeft, status, audioSettings, clearAllIntervals, completeSession])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllIntervals()
  }, [clearAllIntervals])
  
  return {
    timeLeft,
    status,
    mode,
    countdownValue,
    start,
    pause,
    reset,
    skip,
  }
}
