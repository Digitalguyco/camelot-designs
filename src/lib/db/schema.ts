import { randomUUID } from "crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

export const adminUsers = sqliteTable("admin_users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // Stored as integer cents to avoid float rounding; format with formatPrice().
  // Nullable: a product can be listed before its price is finalized —
  // the shop shows "Price on Request" and routes to an enquiry instead.
  priceCents: integer("price_cents"),
  material: text("material").notNull(),
  dimensions: text("dimensions").notNull(),
  sku: text("sku").notNull(),
  status: text("status", { enum: ["available", "preorder", "sold-out"] })
    .notNull()
    .default("available"),
  description: text("description").notNull(),
  // Ordered array of /uploads/... paths. First entry is the cover image.
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const posts = sqliteTable("posts", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  dek: text("dek").notNull(),
  // Sanitized HTML produced by the admin rich-text editor.
  contentHtml: text("content_html").notNull(),
  coverImage: text("cover_image").notNull(),
  readTime: text("read_time").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const projects = sqliteTable("projects", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  projectType: text("project_type").notNull(),
  scope: text("scope").notNull(),
  // Full write-up — may contain multiple paragraphs separated by a blank
  // line; rendered as separate <p> tags rather than compressed into one.
  concept: text("concept").notNull(),
  materials: text("materials").notNull(),
  // Optional — only some projects have bespoke pieces worth calling out.
  customFurniture: text("custom_furniture"),
  role: text("role").notNull(),
  // Ordered array of /uploads/... paths. First entry is the cover image.
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  handled: integer("handled", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
