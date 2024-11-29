'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface LeaderboardProps {
  levelId: number;
}

export default function Leaderboard({ levelId }: LeaderboardProps) {
  const scores = useQuery(api.scores.getScoresByLevel, { levelId });

  if (!scores) return null;

  // Sort scores by highest first
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="space-y-2">
        {sortedScores.map((score, index) => (
          <div 
            key={score._id} 
            className="flex justify-between items-center p-2 bg-white rounded shadow"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">{index + 1}.</span>
              <span>{score.user?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{score.score}%</span>
              <span className="text-sm text-gray-500">
                ({score.distanceFromCenter}px)
              </span>
            </div>
          </div>
        ))}
        {sortedScores.length === 0 && (
          <p className="text-center text-gray-500">No scores yet!</p>
        )}
      </div>
    </div>
  );
} 