import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import { userRoutes } from './routes/userRoutes';
import { CustomHttpException } from './helpers/CustomHttpException';
import { authRoutes } from './routes/authRoutes';

const app = new Hono();

app.use('*', logger());

// app.get('/', async (c) => {
//     const db = await createDbConnection()
//     const asd = await db.get('SELECT * from hero')
//     return c.text('Hello World2!')
// })

app.route('/auth', authRoutes);
app.route('/users', userRoutes);

app.notFound((c) => c.text('Custom 404 Message', 404));

app.onError((err, c) => {
  console.error({ err });
  console.log('err.message', err.message);

  let message = 'something went wrong';
  let status = 500;

  if (err instanceof CustomHttpException) {
    message = err.message;
    status = err.status;
  } else if (err instanceof HTTPException) {
    message = err.message;
    status = err.status;

    if (!message && status === 401) message = 'Unauthorized';
  }

  return c.json({
    success: false,
    message,
  }, status);
});

serve(app);
