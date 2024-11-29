'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const OSCILLATION_SPEED = 10    // Blue
const OSCILLATION_SPEED_2 = 15  // Red
const OSCILLATION_SPEED_3 = 7   // Green
const OSCILLATION_SPEED_4 = 12  // Purple
const OSCILLATION_SPEED_5 = 9   // Orange
const FRAME_RATE = 60

interface Level3Props {
  onComplete: () => void;
  onHome: () => void;
}

export default function Level3({ onComplete, onHome }: Level3Props) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'scored'>('idle')
  const [position, setPosition] = useState(0)
  const [position2, setPosition2] = useState(0)
  const [position3, setPosition3] = useState(0)
  const [position4, setPosition4] = useState(0)
  const [position5, setPosition5] = useState(0)
  const [direction, setDirection] = useState(1)
  const [direction2, setDirection2] = useState(1)
  const [direction3, setDirection3] = useState(1)
  const [direction4, setDirection4] = useState(1)
  const [direction5, setDirection5] = useState(1)
  const [score, setScore] = useState<[number, number] | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const movingDivRef = useRef<HTMLDivElement>(null)
  const movingDivRef2 = useRef<HTMLDivElement>(null)
  const movingDivRef3 = useRef<HTMLDivElement>(null)
  const movingDivRef4 = useRef<HTMLDivElement>(null)
  const movingDivRef5 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + direction * OSCILLATION_SPEED
          const maxPosition = (containerRef.current?.clientWidth || 0) - (movingDivRef.current?.clientWidth || 0)

          if (newPosition <= 0) {
            setDirection(1)
            return 0
          }
          if (newPosition >= maxPosition) {
            setDirection(-1)
            return maxPosition
          }

          return newPosition
        })

        setPosition2((prevPosition) => {
          const newPosition = prevPosition + direction2 * OSCILLATION_SPEED_2
          const maxPosition = (containerRef.current?.clientWidth || 0) - 64

          if (newPosition <= 0) {
            setDirection2(1)
            return 0
          }
          if (newPosition >= maxPosition) {
            setDirection2(-1)
            return maxPosition
          }

          return newPosition
        })

        setPosition3((prevPosition) => {
          const newPosition = prevPosition + direction3 * OSCILLATION_SPEED_3
          const maxPosition = (containerRef.current?.clientWidth || 0) - 128

          if (newPosition <= 0) {
            setDirection3(1)
            return 0
          }
          if (newPosition >= maxPosition) {
            setDirection3(-1)
            return maxPosition
          }

          return newPosition
        })

        setPosition4((prevPosition) => {
          const newPosition = prevPosition + direction4 * OSCILLATION_SPEED_4
          const maxPosition = (containerRef.current?.clientWidth || 0) - (movingDivRef4.current?.clientWidth || 0)

          if (newPosition <= 0) {
            setDirection4(1)
            return 0
          }
          if (newPosition >= maxPosition) {
            setDirection4(-1)
            return maxPosition
          }

          return newPosition
        })

        setPosition5((prevPosition) => {
          const newPosition = prevPosition + direction5 * OSCILLATION_SPEED_5
          const maxPosition = (containerRef.current?.clientWidth || 0) - (movingDivRef5.current?.clientWidth || 0)

          if (newPosition <= 0) {
            setDirection5(1)
            return 0
          }
          if (newPosition >= maxPosition) {
            setDirection5(-1)
            return maxPosition
          }

          return newPosition
        })
      }, 1000 / FRAME_RATE)

      return () => clearInterval(interval)
    }
  }, [gameState, direction, direction2, direction3, direction4, direction5])

  const startGame = () => {
    setScore(null)
    setPosition(0)
    setPosition2(0)
    setPosition3(0)
    setPosition4(0)
    setPosition5(0)
    setDirection(1)
    setDirection2(1)
    setDirection3(1)
    setDirection4(1)
    setDirection5(1)
    setGameState('playing')
  }

  const stopGame = () => {
    if (gameState === 'playing') {
      setGameState('scored')
      const containerWidth = containerRef.current?.clientWidth || 0
      const movingDivWidth = movingDivRef.current?.clientWidth || 0
      const centerPosition = (containerWidth - movingDivWidth) / 2
      const distanceFromCenter = Math.abs(position - centerPosition)
      const maxDistance = containerWidth / 2
      const normalizedScore = Math.round((1 - distanceFromCenter / maxDistance) * 100)
      setScore([normalizedScore, Math.round(distanceFromCenter)])
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold text-center mb-4">Level 3</h1>
      <div className="mb-4 text-center">
        {gameState === 'idle' && <p>Click stop when the <span className="text-blue-500">BLUE</span> div is centered</p>}
        {gameState === 'playing' && <p>Too fast for you?</p>}
        {gameState === 'scored' && score && (
          <p>Your score: {score[0]}% ({score[1]}px from center)</p>
        )}
      </div>
      <div 
        ref={containerRef} 
        className="relative h-16 bg-gray-200 mb-4"
      >
        <div
          ref={movingDivRef}
          className="absolute top-0 h-full w-4 bg-blue-500"
          style={{ transform: `translateX(${position}px)` }}
        />
        <div
          ref={movingDivRef2}
          className="absolute top-0 h-full w-5 bg-red-500"
          style={{ transform: `translateX(${containerRef.current?.clientWidth ? containerRef.current.clientWidth - 64 - position2 : 0}px)` }}
        />
        <div
          ref={movingDivRef3}
          className="absolute top-0 h-full w-6 bg-green-500"
          style={{ transform: `translateX(${containerRef.current?.clientWidth ? containerRef.current.clientWidth - 128 - position3 : 0}px)` }}
        />
        <div
          ref={movingDivRef4}
          className="absolute top-0 h-full w-4 bg-purple-500"
          style={{ transform: `translateX(${position4}px)` }}
        />
        <div
          ref={movingDivRef5}
          className="absolute top-0 h-full w-4 bg-orange-500"
          style={{ transform: `translateX(${position5}px)` }}
        />
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={onHome} variant="outline">Home</Button>
        {gameState === 'idle' && (
          <Button onClick={startGame}>Start Game</Button>
        )}
        {gameState === 'playing' && (
          <Button onClick={stopGame}>Stop</Button>
        )}
        {gameState === 'scored' && (
          <>
            <Button onClick={startGame}>Try Again</Button>
            {score && score[0] >= 90 && (
              <Button onClick={onComplete} variant="secondary">
                Next Level
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
} 