import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userSession = sqliteTable("user_session" ,{
    id: integer({ mode: 'number' }).primaryKey().notNull(),
    token: text(),
    userData: text().notNull(),
    dateLastSession: integer({ mode: 'timestamp' }).notNull(),
    statusSession: integer({ mode: 'boolean' }).notNull(),
    finLastSession: integer({ mode: 'timestamp' }).notNull()
});

export type UserSession = typeof userSession.$inferSelect;

