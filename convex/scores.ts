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
    // Find existing score for this user and level
    const existingScore = await ctx.db
      .query("score")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("levelId"), args.levelId))
      .first();

    // If there's an existing score and it's higher, don't update
    if (existingScore && existingScore.score >= args.score) {
      return existingScore._id;
    }

    // If there's an existing score but the new score is higher, update it
    if (existingScore) {
      return await ctx.db.patch(existingScore._id, {
        score: args.score,
        distanceFromCenter: args.distanceFromCenter,
      });
    }

    // If no existing score, create a new one
    return await ctx.db.insert("score", {
      score: args.score,
      userId: args.userId,
      levelId: args.levelId,
      distanceFromCenter: args.distanceFromCenter,
      createdAt: new Date().toISOString(),
    });
  },
});

export const deleteScore = mutation({
  args: { id: v.id("score") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});