import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for digital products
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  longDescription: text("longDescription"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: mysqlEnum("category", ["cto", "growth", "pm", "workflows", "prompts"]).notNull(),
  fileUrl: varchar("fileUrl", { length: 512 }),
  fileKey: varchar("fileKey", { length: 512 }),
  image: varchar("image", { length: 512 }),
  showcaseImage1: varchar("showcaseImage1", { length: 512 }),
  showcaseImage2: varchar("showcaseImage2", { length: 512 }),
  showcaseImage3: varchar("showcaseImage3", { length: 512 }),
  featured: int("featured").default(0),
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Bundle products (combinations of products at discounted prices)
 */
export const bundles = mysqlTable("bundles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  productIds: json("productIds"),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  featured: int("featured").default(0),
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bundle = typeof bundles.$inferSelect;
export type InsertBundle = typeof bundles.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerName: varchar("customerName", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items (products in each order)
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId"),
  bundleId: int("bundleId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Product purchases - tracks which users bought which products
 */
export const productPurchases = mysqlTable("productPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  orderId: int("orderId").notNull(),
  downloadToken: varchar("downloadToken", { length: 255 }).unique(),
  downloadCount: int("downloadCount").default(0),
  lastDownloadedAt: timestamp("lastDownloadedAt"),
  expiresAt: timestamp("expiresAt"),
  noRefundAcknowledged: int("noRefundAcknowledged").default(0),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type ProductPurchase = typeof productPurchases.$inferSelect;
export type InsertProductPurchase = typeof productPurchases.$inferInsert;

/**
 * Email logs for tracking sent emails
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  emailType: mysqlEnum("emailType", [
    "welcome",
    "order_confirmation",
    "product_delivery",
    "download_link",
    "receipt",
    "support",
    "no_refund_policy"
  ]).notNull(),
  orderId: int("orderId"),
  subject: varchar("subject", { length: 255 }),
  emailStatus: mysqlEnum("emailStatus", ["pending", "sent", "failed", "bounced"]).default("pending"),
  sentAt: timestamp("sentAt"),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Agent Conversations - Stores chat history between user and agents
 */
export const agentConversations = mysqlTable("agentConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  agentRole: varchar("agentRole", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "archived", "completed"]).default("active"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentConversation = typeof agentConversations.$inferSelect;
export type InsertAgentConversation = typeof agentConversations.$inferInsert;

/**
 * Agent Messages - Stores individual messages in conversations
 */
export const agentMessages = mysqlTable("agentMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "agent", "system"]).notNull(),
  agentRole: varchar("agentRole", { length: 64 }),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentMessage = typeof agentMessages.$inferSelect;
export type InsertAgentMessage = typeof agentMessages.$inferInsert;

/**
 * Agent Tasks - Stores tasks assigned to agents
 */
export const agentTasks = mysqlTable("agentTasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId"),
  agentRole: varchar("agentRole", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed", "cancelled"]).default("pending"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  result: text("result"),
  errorMessage: text("errorMessage"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type AgentTask = typeof agentTasks.$inferSelect;
export type InsertAgentTask = typeof agentTasks.$inferInsert;

/**
 * API Integrations - Stores configured API connections
 */
export const apiIntegrations = mysqlTable("apiIntegrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceName: varchar("serviceName", { length: 128 }).notNull(),
  displayName: varchar("displayName", { length: 255 }),
  description: text("description"),
  isActive: int("isActive").default(1),
  config: json("config").notNull(),
  lastTestedAt: timestamp("lastTestedAt"),
  testStatus: mysqlEnum("testStatus", ["untested", "success", "failed"]).default("untested"),
  testError: text("testError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiIntegration = typeof apiIntegrations.$inferSelect;
export type InsertApiIntegration = typeof apiIntegrations.$inferInsert;

/**
 * Agent Configurations - Stores agent behavior and settings
 */
export const agentConfigurations = mysqlTable("agentConfigurations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentRole: varchar("agentRole", { length: 64 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }),
  description: text("description"),
  systemPrompt: text("systemPrompt"),
  isActive: int("isActive").default(1),
  config: json("config"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentConfiguration = typeof agentConfigurations.$inferSelect;
export type InsertAgentConfiguration = typeof agentConfigurations.$inferInsert;

/**
 * Workflows - Stores automated workflows
 */
export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 128 }).notNull(),
  actions: json("actions"),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;
