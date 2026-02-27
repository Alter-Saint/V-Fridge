import { relations } from "drizzle-orm/relations";
import { users, products, chat } from "./schema";

export const productsRelations = relations(products, ({one}) => ({
	user: one(users, {
		fields: [products.ownerId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	products: many(products),
	chats: many(chat),
}));

export const chatRelations = relations(chat, ({one}) => ({
	user: one(users, {
		fields: [chat.userId],
		references: [users.id]
	}),
}));