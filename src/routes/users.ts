import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db, users, type NewUser } from '../db/index.js';

const usersRouter = new Hono();

// GET /users - 全ユーザー取得
usersRouter.get('/', async (c) => {
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

// GET /users/:id - 特定ユーザー取得
usersRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const result = await db.select().from(users).where(eq(users.id, id));
  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json(result[0]);
});

// POST /users - ユーザー作成
usersRouter.post('/', async (c) => {
  const body = await c.req.json<NewUser>();
  const newUser = await db.insert(users).values(body).returning();
  return c.json(newUser[0], 201);
});

// PUT /users/:id - ユーザー更新
usersRouter.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json<Partial<NewUser>>();
  const updated = await db
    .update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  if (updated.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json(updated[0]);
});

// DELETE /users/:id - ユーザー削除
usersRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const deleted = await db.delete(users).where(eq(users.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({ message: 'User deleted' });
});

export { usersRouter };
