import { v } from "convex/values";
import { query } from "./_generated/server";

// Release notes for the launcher, seeded at deploy time from the public
// DroidBridge source repositories. Read-only for the client.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("changelog").order("desc").take(12);
  },
});

export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("changelog").order("desc").first();
  },
});

export const seed = v.null();
export const seedArgs = v.object({
  entries: v.array(
    v.object({
      version: v.string(),
      channel: v.union(
        v.literal("stable"),
        v.literal("beta"),
        v.literal("offline"),
      ),
      releasedAt: v.number(),
      highlights: v.array(v.string()),
    }),
  ),
});
