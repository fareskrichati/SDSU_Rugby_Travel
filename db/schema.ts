import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const packets = sqliteTable('packets', { id: integer('id').primaryKey(), content: text('content').notNull(), version: integer('version').notNull().default(1) });
