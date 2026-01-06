'use client'

import { useEffect, useState, useMemo } from 'react'

interface Star {
  id: number
  left: string
  top: string
  delay: number
  duration: number
  size: number
}

export function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const getStarCount = () => {
      const width = window.innerWidth
      if (width >= 3840) return 200 // 4K TV
      if (width >= 2560) return 150 // Large TV
      if (width >= 1920) return 120 // Full HD
      if (width >= 1200) return 80
      if (width >= 768) return 50
      return 30 // Mobile - reduced for performance
    }

    const count = getStarCount()
    const newStars: Star[] = []

    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 3,
        size: 1.5 + Math.random() * 1.5,
      })
    }

    setStars(newStars)
  }, [])

  const starElements = useMemo(() => stars.map(star => (
    <div
      key={star.id}
      className="absolute rounded-full bg-white star-twinkle"
      style={{
        left: star.left,
        top: star.top,
        width: star.size,
        height: star.size,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`,
        willChange: 'opacity',
      }}
    />
  )), [stars])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {starElements}
    </div>
  )
}
