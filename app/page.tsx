'use client'

import { useState, useEffect } from 'react'
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Level1 from '@/app/components/levels/Level1'
import Level2 from '@/app/components/levels/Level2'
import Level3 from '@/app/components/levels/Level3'
import Level4 from '@/app/components/levels/Level4'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface LevelProps {
  onComplete: () => void;
  onHome: () => void;
}

interface LevelInfo {
  id: number;
  name: string;
  component: React.ComponentType<LevelProps>;
  unlocked: boolean;
  isBeaten: boolean;
}

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [levels, setLevels] = useState<LevelInfo[]>([
    { id: 1, name: "Level 1 (From the screen 📺 to the ring 🥊 to the pen 🖊️ to the king 👑! Where's my crown 👑 🤷‍♂️ that's my bling 💍)", component: Level1, unlocked: true, isBeaten: false },
    { id: 2, name: 'Level 2 (Sigma)', component: Level2, unlocked: false, isBeaten: false }, 
    { id: 3, name: "Level 3 (Those who know 💀)", component: Level3, unlocked: false, isBeaten: false },
    { id: 4, name: "Level 4 (Boy oh boy where do I even begin. Lebron... honey, my pookie bear. I have loved you ever since I first laid eyes on you. The way you drive into the paint and strike fear into your enemies eyes. Your silky smooth touch around the rim, and that gorgeous jumpshot. I would do anything for you.)", component: Level4, unlocked: false, isBeaten: false },
  ])

  const userProgress = useQuery(api.users.getUserByClerkId, { 
    clerkId: user?.id ?? "skip" 
  });
  const updateProgress = useMutation(api.users.updateUserProgress);

  const [lastLevelBeaten, setLastLevelBeaten] = useState(false);

  useEffect(() => {
    if (userProgress?.progress) {
      setLevels(prev => prev.map(level => {
        const savedLevel = userProgress.progress?.find(p => p.id === level.id);
        return savedLevel ? { 
          ...level, 
          unlocked: savedLevel.unlocked,
          isBeaten: savedLevel.isBeaten 
        } : level;
      }));
      
      const lastLevel = userProgress.progress[userProgress.progress.length - 1];
      if (lastLevel?.isBeaten) {
        setLastLevelBeaten(true);
      }
    }
  }, [userProgress]);

  const handleLevelComplete = async () => {
    const nextLevelIndex = currentLevel !== null ? currentLevel : 0;
    const isLastLevel = nextLevelIndex === levels.length - 1;
    
    const updatedLevels = levels.map((level, index) => {
      if (index === nextLevelIndex) {
        return { ...level, unlocked: true, isBeaten: true };
      }
      if (index === nextLevelIndex + 1) {
        return { ...level, unlocked: true };
      }
      return level;
    });
    
    setLevels(updatedLevels);
    
    if (isLastLevel) {
      setLastLevelBeaten(true);
    }
    
    if (isSignedIn && user) {
      await updateProgress({
        clerkId: user.id,
        progress: updatedLevels.map(({ id, name, unlocked, isBeaten }) => ({
          id,
          name,
          unlocked,
          isBeaten
        }))
      });
    }
    
    setCurrentLevel(null);
  };

  const handleHome = () => {
    setCurrentLevel(null);
    const hasBeatenLevel = levels.some(level => level.isBeaten);
    setLastLevelBeaten(hasBeatenLevel);
  };

  useEffect(() => {
    const hasBeatenLevel = levels.some(level => level.isBeaten);
    setLastLevelBeaten(hasBeatenLevel);
  }, [levels]);

  if (currentLevel !== null && currentLevel < levels.length) {
    const LevelComponent = levels[currentLevel].component
    return <LevelComponent 
      onComplete={handleLevelComplete} 
      onHome={handleHome}
    />
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <h1 className="text-3xl font-bold">The &lt;div&gt;eloper Experience</h1>
        </div>
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
        <div className={`max-w-2xl w-full text-center mb-12 ${!lastLevelBeaten ? 'translate-x-40' : ''}`}>
          <h1 className="text-4xl font-bold mb-4">
            {lastLevelBeaten 
              ? "Wow! Guess you are a real developer!"
              : "Are you a real developer if you can't center a div?"}
          </h1>
        </div>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            {levels.map((level, index) => {
              const isBeaten = level.isBeaten;
              
              return (
                <div 
                  key={level.id}
                  className={`
                    p-8 rounded-lg transition-all duration-500 ease-in-out
                    ${level.unlocked 
                      ? 'bg-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-100 opacity-75'}
                    ${!isBeaten && index === 0 ? `translate-x-[160px]` : ''}
                    ${!isBeaten && index === 1 ? `-translate-x-[160px]` : ''}
                    ${!isBeaten && index === 2 ? `translate-x-[80px]` : ''}
                    ${!isBeaten && index === 3 ? `-translate-x-[80px]` : ''}
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
                      {level.unlocked ? 'Start' : 'Locked'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}