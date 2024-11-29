import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getScoresByLevel = query({
  args: { levelId: v.number() },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("score")
      .filter((q) => q.eq(q.field("levelId"), args.levelId))
      .collect();

    const scoresWithUsers = await Promise.all(
      scores.map(async (score) => {
        const user = await ctx.db.get(score.userId);
        return {
          ...score,
          user: user ? {
            name: user.name,
            image: user.image
          } : null
        };
      })
    );

    return scoresWithUsers;
  },
});

export const createScore = mutation({
  args: {
    score: v.number(),
    userId: v.id("user"),
    levelId: v.number(),
    distanceFromCenter: v.number(),
  },
  handler: async (ctx, args) => {
    const scoreId = await ctx.db.insert("score", {
      score: args.score,
      userId: args.userId,
      levelId: args.levelId,
      distanceFromCenter: args.distanceFromCenter,
      createdAt: new Date().toISOString(),
    });
    return scoreId;
  },
});

export const deleteScore = mutation({
  args: { id: v.id("score") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});