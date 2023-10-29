import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { bearerAuth } from 'hono/bearer-auth';
import { CustomHttpException } from '../helpers/CustomHttpException';
import { userCreateHandler, userReadHandler } from '../modules/users/handlers';
import { userCreateSchema } from '../modules/users/schemas';

export const userRoutes = new Hono();

userRoutes.use(
  '*',
  (c, next) => {
    const authorization = c.req.header('authorization');
    const token = authorization?.split(' ').pop() || 'token not found';

    return bearerAuth({ token })(c, next);
  },
);

userRoutes.get('', userReadHandler);

userRoutes.post('', zValidator(
  'json',
  userCreateSchema,
  (result) => {
    if (!result.success) {
      throw new CustomHttpException(
        400,
        result.error.issues[0].message,
      );
    }
  },
), userCreateHandler);
