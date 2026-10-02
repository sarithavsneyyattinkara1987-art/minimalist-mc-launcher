import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // A launcher instance: one Minecraft Java Edition install managed by
    // DroidBridge on an Android device.
    instances: defineTable({
      userId: v.id("users"),
      name: v.string(),
      mcVersion: v.string(),
      loader: v.union(
        v.literal("vanilla"),
        v.literal("fabric"),
        v.literal("quilt"),
        v.literal("neoforge"),
        v.literal("forge"),
      ),
      renderer: v.union(
        v.literal("ltw"),
        v.literal("mobile_glues"),
        v.literal("zink"),
        v.literal("virgl"),
      ),
      javaRuntime: v.union(v.literal("jre8"), v.literal("jre17"), v.literal("jre21")),
      controlLayout: v.string(),
      ramMb: v.number(),
      status: v.union(
        v.literal("ready"),
        v.literal("installing"),
        v.literal("broken"),
      ),
      lastPlayedAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_status", ["userId", "status"]),

    // Release notes for the launcher itself (seeded from the public repos).
    changelog: defineTable({
      version: v.string(),
      channel: v.union(v.literal("stable"), v.literal("beta"), v.literal("offline")),
      releasedAt: v.number(),
      highlights: v.array(v.string()),
    }).index("by_version", ["version"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
