import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db, posts, users, type NewPost } from '../db/index.js';

const postsRouter = new Hono();

// GET /posts - 全投稿取得（著者情報付き）
postsRouter.get('/', async (c) => {
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id));
  return c.json(allPosts);
});

// GET /posts/:id - 特定投稿取得
postsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .where(eq(posts.id, id))
    .leftJoin(users, eq(posts.authorId, users.id));
  if (result.length === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }
  return c.json(result[0]);
});

// POST /posts - 投稿作成
postsRouter.post('/', async (c) => {
  const body = await c.req.json<NewPost>();
  const newPost = await db.insert(posts).values(body).returning();
  return c.json(newPost[0], 201);
});

// PUT /posts/:id - 投稿更新
postsRouter.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json<Partial<NewPost>>();
  const updated = await db
    .update(posts)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  if (updated.length === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }
  return c.json(updated[0]);
});

// DELETE /posts/:id - 投稿削除
postsRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const deleted = await db.delete(posts).where(eq(posts.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }
  return c.json({ message: 'Post deleted' });
});

// GET /posts/user/:userId - 特定ユーザーの投稿一覧
postsRouter.get('/user/:userId', async (c) => {
  const userId = parseInt(c.req.param('userId'), 10);
  const userPosts = await db.select().from(posts).where(eq(posts.authorId, userId));
  return c.json(userPosts);
});

export { postsRouter };
