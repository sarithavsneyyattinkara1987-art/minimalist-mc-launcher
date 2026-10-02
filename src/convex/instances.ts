import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const loaderValidator = v.union(
  v.literal("vanilla"),
  v.literal("fabric"),
  v.literal("quilt"),
  v.literal("neoforge"),
  v.literal("forge"),
);

const rendererValidator = v.union(
  v.literal("ltw"),
  v.literal("mobile_glues"),
  v.literal("zink"),
  v.literal("virgl"),
);

const runtimeValidator = v.union(
  v.literal("jre8"),
  v.literal("jre17"),
  v.literal("jre21"),
);

const statusValidator = v.union(
  v.literal("ready"),
  v.literal("installing"),
  v.literal("broken"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return [];
    }
    return await ctx.db
      .query("instances")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return 0;
    }
    const all = await ctx.db
      .query("instances")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return all.length;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    mcVersion: v.string(),
    loader: loaderValidator,
    renderer: rendererValidator,
    javaRuntime: runtimeValidator,
    controlLayout: v.optional(v.string()),
    ramMb: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("instances", {
      userId,
      name: args.name.slice(0, 80),
      mcVersion: args.mcVersion,
      loader: args.loader,
      renderer: args.renderer,
      javaRuntime: args.javaRuntime,
      controlLayout: args.controlLayout ?? "default",
      ramMb: Math.min(8192, Math.max(1024, args.ramMb)),
      status: "installing",
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("instances"), status: statusValidator },
  handler: async (ctx, { id, status }) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const instance = await ctx.db.get(id);
    if (!instance || instance.userId !== userId) {
      throw new Error("Instance not found");
    }
    await ctx.db.patch(id, { status });
  },
});

export const markPlayed = mutation({
  args: { id: v.id("instances") },
  handler: async (ctx, { id }) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const instance = await ctx.db.get(id);
    if (!instance || instance.userId !== userId) {
      throw new Error("Instance not found");
    }
    await ctx.db.patch(id, { lastPlayedAt: Date.now(), status: "ready" });
  },
});

export const remove = mutation({
  args: { id: v.id("instances") },
  handler: async (ctx, { id }) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const instance = await ctx.db.get(id);
    if (!instance || instance.userId !== userId) {
      throw new Error("Instance not found");
    }
    await ctx.db.delete(id);
  },
});
