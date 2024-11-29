import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  score: defineTable({
    userId: v.id("user"),
    score: v.number(),
    levelId: v.number(),
    distanceFromCenter: v.number(),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_levelId", ["levelId"]),
  
  user: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
    progress: v.optional(v.array(v.object({
      id: v.number(),
      name: v.string(),
      unlocked: v.boolean(),
      isBeaten: v.boolean(),
    }))),
  }),
});
 