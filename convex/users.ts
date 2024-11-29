import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// First, define a type for the progress object to ensure consistency
const progressValidator = v.object({
  id: v.number(),
  name: v.string(),
  unlocked: v.boolean(),
  isBeaten: v.boolean(),
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Add initial progress for all levels
    const initialProgress = [
      { id: 1, name: 'Level 1 (Baby Gronk)', unlocked: true, isBeaten: false },
      { id: 2, name: 'Level 2 (Sigma)', unlocked: false, isBeaten: false },
      { id: 3, name: "Level 3 (Those who know 💀)", unlocked: false, isBeaten: false },
      { id: 4, name: "Level 4 (Boy oh boy...)", unlocked: false, isBeaten: false },
    ];

    return await ctx.db.insert("user", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
      progress: initialProgress,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    return user;
  },
});

export const updateUserProgress = mutation({
  args: {
    clerkId: v.string(),
    progress: v.array(progressValidator),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    
    if (!user) return null;
    
    return await ctx.db.patch(user._id, {
      progress: args.progress
    });
  },
});