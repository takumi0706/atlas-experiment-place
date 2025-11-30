import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  bio: varchar('bio', { length: 500 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
