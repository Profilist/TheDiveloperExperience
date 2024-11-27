'use client'

import { useState, useEffect } from 'react'
import Level1 from '@/app/components/levels/Level1'
import Level2 from '@/app/components/levels/Level2'
import { Button } from '@/components/ui/button'

interface LevelInfo {
  id: number;
  name: string;
  component: React.ComponentType<{ onComplete: () => void }>;
  unlocked: boolean;
}

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [levels, setLevels] = useState<LevelInfo[]>([
    { id: 1, name: 'Level 1', component: Level1, unlocked: true },
    { id: 2, name: 'Level 2', component: Level2, unlocked: false },
  ])

  useEffect(() => {
    const savedProgress = localStorage.getItem('gameProgress')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setLevels(levels.map((level, index) => ({
        ...level,
        unlocked: parsed[index].unlocked
      })))
    }
  }, [])

  const handleLevelComplete = () => {
    const nextLevelIndex = currentLevel !== null ? currentLevel : 0
    if (nextLevelIndex < levels.length - 1) {
      const updatedLevels = levels.map((level, index) => {
        if (index === nextLevelIndex + 1) {
          return { ...level, unlocked: true }
        }
        return level
      })
      setLevels(updatedLevels)
      localStorage.setItem('gameProgress', JSON.stringify(updatedLevels))
    }
    setCurrentLevel(null) 
  }

  if (currentLevel !== null && currentLevel < levels.length) {
    const LevelComponent = levels[currentLevel].component
    console.log(levels[currentLevel].component)
    return <LevelComponent onComplete={handleLevelComplete} />
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">The Diveloper Experience</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {levels.map((level, index) => (
          <div 
            key={level.id}
            className="p-6 border rounded-lg shadow-sm text-center"
          >
            <h2 className="text-xl font-semibold mb-4">{level.name}</h2>
            <Button
              onClick={() => setCurrentLevel(index)}
              disabled={!level.unlocked}
              variant={level.unlocked ? "default" : "secondary"}
            >
              {level.unlocked ? 'Play' : 'Locked'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}