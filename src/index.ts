import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { usersRouter, postsRouter } from './routes/index.js';

const app = new Hono();

// ミドルウェア
app.use('*', logger());

// ルート
app.get('/', (c) => {
  return c.json({
    message: 'Atlas + Drizzle MVP',
    endpoints: {
      users: '/users',
      posts: '/posts',
    },
  });
});

app.route('/users', usersRouter);
app.route('/posts', postsRouter);

// サーバー起動
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
