'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2 } from 'lucide-react'

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('webkitfullscreenchange', handleChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('webkitfullscreenchange', handleChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error)
    }
  }

  return (
    <motion.button
      onClick={toggleFullscreen}
      className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-5 lg:right-5 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center bg-white/5 border-2 border-gray-600 text-gray-400 rounded-lg z-50"
      whileHover={{ scale: 1.1, borderColor: '#ffffff', color: '#ffffff' }}
      whileTap={{ scale: 0.95 }}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
    </motion.button>
  )
}
