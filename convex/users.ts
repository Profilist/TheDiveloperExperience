import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("user", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.union(v.string(), v.literal("skip")) },
  handler: async (ctx, args) => {
    if (args.clerkId === "skip") return null;
    return await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const updateUserProgress = mutation({
  args: {
    clerkId: v.string(),
    progress: v.array(v.object({
      id: v.number(),
      name: v.string(),
      unlocked: v.boolean()
    }))
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