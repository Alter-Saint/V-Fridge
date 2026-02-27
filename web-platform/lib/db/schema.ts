import { pgTable, unique, serial, varchar, text, timestamp, foreignKey, numeric, date, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("users_username_key").on(table.username),
	unique("users_email_key").on(table.email),
]);

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	quantity: numeric({ precision: 10, scale:  2 }).notNull(),
	unit: varchar({ length: 20 }).notNull(),
	expiryDate: date("expiry_date"),
	ownerId: integer("owner_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "products_owner_id_fkey"
		}).onDelete("cascade"),
]);

export const chat = pgTable("chat", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	role: varchar({ length: 20 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "chat_user_id_fkey"
		}).onDelete("cascade"),
]);
