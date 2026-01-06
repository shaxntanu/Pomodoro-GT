'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRandomQuote } from '@/lib/quotes'

export function Quote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  return (
    <div className="min-h-[32px] sm:min-h-[40px] md:min-h-[50px] lg:min-h-[60px] flex items-center justify-center mb-3 sm:mb-4 md:mb-6 w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
      <AnimatePresence mode="wait">
        <motion.p
          key={quote}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-500 italic text-center px-3 sm:px-4 md:px-6 lg:px-8"
        >
          &ldquo;{quote}&rdquo;
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
