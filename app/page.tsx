'use client'

import { useState, useEffect } from 'react'
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Level1 from '@/app/components/levels/Level1'
import Level2 from '@/app/components/levels/Level2'
import Level3 from '@/app/components/levels/Level3'
import { Button } from '@/components/ui/button'

interface LevelProps {
  onComplete: () => void;
  onHome: () => void;
}

interface LevelInfo {
  id: number;
  name: string;
  component: React.ComponentType<LevelProps>;
  unlocked: boolean;
}

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [levels, setLevels] = useState<LevelInfo[]>([
    { id: 1, name: 'Level 1 (Student)', component: Level1, unlocked: true },
    { id: 2, name: 'Level 2 (Junior Developer)', component: Level2, unlocked: false }, 
    { id: 3, name: 'Level 3 (Senior Developer)', component: Level3, unlocked: false },
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

  const handleHome = () => {
    setCurrentLevel(null)
  }

  if (currentLevel !== null && currentLevel < levels.length) {
    const LevelComponent = levels[currentLevel].component
    console.log(levels[currentLevel].component)
    return <LevelComponent 
      onComplete={handleLevelComplete} 
      onHome={handleHome}
    />
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">The Diveloper Experience</h1>
        <div>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.firstName}</span>
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-2xl w-full text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">The &lt;div&gt;eloper Experience</h1>
          <p className="text-gray-600 mb-8">
            Are you a real developer if you can't center a div?
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            {levels.map((level, index) => (
              <div 
                key={level.id}
                className={`
                  p-8 rounded-lg transition-all duration-200
                  ${level.unlocked 
                    ? 'bg-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 opacity-75'}
                `}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{level.name}:</h2>
                  <Button
                    onClick={() => setCurrentLevel(index)}
                    disabled={!level.unlocked}
                    variant={level.unlocked ? "default" : "secondary"}
                    className={`
                      px-8 py-2
                      ${level.unlocked 
                        ? 'hover:scale-105 transition-transform' 
                        : 'cursor-not-allowed'}
                    `}
                  >
                    {level.unlocked ? 'Play' : 'Locked'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}