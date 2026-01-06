'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onSpace: () => void
  onEscape: () => void
  onR: () => void
  onS: () => void
  onT: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          handlers.onSpace()
          break
        case 'Escape':
          handlers.onEscape()
          break
        case 'KeyR':
          if (!e.ctrlKey && !e.metaKey) {
            handlers.onR()
          }
          break
        case 'KeyS':
          if (!e.ctrlKey && !e.metaKey) {
            handlers.onS()
          }
          break
        case 'KeyT':
          if (!e.ctrlKey && !e.metaKey) {
            handlers.onT()
          }
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
