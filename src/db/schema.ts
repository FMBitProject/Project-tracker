import { pgTable, uuid, text, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { priorityEnum, statusEnum } from "./enums";

// Better-Auth User table (export name MUST be "user" for better-auth)
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    // Tambahkan $defaultFn untuk menjamin ini adalah Date object
    createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
});

// Better-Auth Session table (export name MUST be "session" for better-auth)
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// Better-Auth Account table (export name MUST be "account" for better-auth)
export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
});

// Better-Auth Verification table (export name MUST be "verification" for better-auth)
export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(() => new Date()),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

// Projects table
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    userId: text("user_id").notNull().references(() => user.id),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date()),
});

// Tasks table
export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    userId: text("user_id").notNull().references(() => user.id),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    priority: priorityEnum("task_priority").default("medium").notNull(),
    status: statusEnum("status").default("todo").notNull(),
    progress: integer("progress").default(0).notNull(),
    startDate: timestamp("start_date", { mode: "date" }).notNull(),
    endDate: timestamp("end_date", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date()),
});

// Types
export type User = typeof user.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;

export type NewUser = typeof user.$inferInsert;
export type NewProject = typeof projects.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
