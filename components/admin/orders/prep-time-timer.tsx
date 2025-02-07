/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface PrepTimeTimerProps {
  prepTimeMinutes: number | undefined
  startTime: string | undefined
  status: string
}

export default function PrepTimeTimer({ prepTimeMinutes, startTime, status }: PrepTimeTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isOvertime, setIsOvertime] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // We intentionally exclude intervalId from deps as it's managed within the effect
    if (status !== 'preparing') {
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      return
    }

    const prepStartTime = new Date(startTime!).getTime()
    const prepEndTime = prepStartTime + (prepTimeMinutes! * 60 * 1000)
    
    const updateTimer = () => {
      const now = new Date().getTime()
      const timeDiff = prepEndTime - now

      if (timeDiff <= 0) {
        setIsOvertime(true)
        setTimeLeft(Math.abs(Math.floor(timeDiff / 1000)))
      } else {
        setIsOvertime(false)
        setTimeLeft(Math.floor(timeDiff / 1000))
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    setIntervalId(interval)

    return () => {
      clearInterval(interval)
      setIntervalId(null)
    }
  }, [prepTimeMinutes, startTime, status])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <AnimatePresence mode="wait">
      {status === 'preparing' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Badge 
            variant={isOvertime ? "destructive" : "default"}
            className="text-lg py-2"
          >
            {isOvertime ? 'OVERTIME: ' : 'Time Left: '}
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  )
}