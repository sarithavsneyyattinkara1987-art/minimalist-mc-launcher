import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Seeds the changelog table with real release notes drawn from the public
// DroidBridge source repositories (see android/docs/UPSTREAM_README.md and
// android/variants/offline/README.md). Idempotent: skips entries whose
// version already exists.
const ENTRIES = [
  {
    version: "0.2.15-offline",
    channel: "offline" as const,
    releasedAt: Date.parse("2026-09-01"),
    highlights: [
      "OFFLINE line: Pojav-derived runtime with preinstalled components",
      "Touch controller proxy integration",
      "Controls editor with per-instance layouts",
    ],
  },
  {
    version: "0.7.15",
    channel: "stable" as const,
    releasedAt: Date.parse("2026-08-12"),
    highlights: [
      "Vulkan Extra crash on video settings fixed",
      "MCSR Ranked compatibility restored",
      "LTW renderer support for 26.3 on most devices",
    ],
  },
  {
    version: "0.7.14",
    channel: "stable" as const,
    releasedAt: Date.parse("2026-07-30"),
    highlights: [
      "Per-instance renderer settings no longer leak into new instances",
      "Voice-chat recording toggle: game only, or voice plus game",
      "Vulkan Mod NeoForge support",
    ],
  },
  {
    version: "0.3.14",
    channel: "beta" as const,
    releasedAt: Date.parse("2026-06-19"),
    highlights: [
      "Instance management overhaul",
      "Renderer configuration per version",
      "Android 10 stability improvements",
    ],
  },
];

export const seedChangelog = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const entry of ENTRIES) {
      const existing = await ctx.db
        .query("changelog")
        .withIndex("by_version", (q) => q.eq("version", entry.version))
        .first();
      if (existing) continue;
      await ctx.db.insert("changelog", entry);
    }
  },
});

export const seedArgsValidator = v.null();
