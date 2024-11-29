'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Leaderboard from '../Leaderboard';

const OSCILLATION_SPEED = 10
const FRAME_RATE = 60

interface Level2Props {
  onComplete: () => void;
  onHome: () => void;
}

export default function Level2({ onComplete, onHome }: Level2Props) {
  const { user, isSignedIn } = useUser();
  const createScore = useMutation(api.scores.createScore);
  const getUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const createConvexUser = useMutation(api.users.createUser);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'scored'>('idle')
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(1)
  const [score, setScore] = useState<[number, number] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const movingDivRef = useRef<HTMLDivElement>(null)

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
      }, 1000 / FRAME_RATE)

      return () => clearInterval(interval)
    }
  }, [gameState, direction])

  const startGame = () => {
    setScore(null)
    setPosition(0)
    setDirection(1)
    setGameState('playing')
  }

  const stopGame = async () => {
    if (gameState === 'playing') {
      setGameState('scored')
      const containerWidth = containerRef.current?.clientWidth || 0
      const movingDivWidth = movingDivRef.current?.clientWidth || 0
      const centerPosition = (containerWidth - movingDivWidth) / 2
      const distanceFromCenter = Math.abs(position - centerPosition)
      const maxDistance = containerWidth / 2
      const normalizedScore = Math.round((1 - distanceFromCenter / maxDistance) * 100)
      setScore([normalizedScore, Math.round(distanceFromCenter)])

      if (isSignedIn && user) {
        let convexUserId = getUser?._id;
        if (!convexUserId) {
          convexUserId = await createConvexUser({
            clerkId: user.id,
            name: user.fullName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            image: user.imageUrl,
          });
        }
        
        await createScore({
          score: normalizedScore,
          userId: convexUserId,
          levelId: 2,
          distanceFromCenter: Math.round(distanceFromCenter),
        });
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold text-center mb-4">Level 2</h1>
      <div className="mb-4 text-center">
        {gameState === 'idle' && <p>Was that too easy?</p>}
        {gameState === 'playing' && <p>There's no way this is stopping you right...</p>}
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
          className="absolute top-0 h-full w-8 bg-blue-500"
          style={{ transform: `translateX(${position}px)` }}
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

      <Leaderboard levelId={2} />
    </div>
  )
} 