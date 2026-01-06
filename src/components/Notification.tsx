'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationProps {
  message: string
  show: boolean
  onHide: () => void
}

export function Notification({ message, show, onHide }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onHide])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-2 right-12 sm:top-3 sm:right-16 md:top-4 md:right-20 bg-white/90 text-black px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-mono text-xs sm:text-sm md:text-base z-50 shadow-lg max-w-[70vw] sm:max-w-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useNotification() {
  const [notification, setNotification] = useState({ message: '', show: false })

  const showNotification = useCallback((message: string) => {
    setNotification({ message, show: true })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }))
  }, [])

  return { notification, showNotification, hideNotification }
}
