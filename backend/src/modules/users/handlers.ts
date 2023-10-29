import { Handler } from 'hono/dist/types/types';
import { UserCreate } from './types';
import { uuidv4 } from '../../helpers/uuidv4';
import { createDbConnection } from '../../db';

export const userCreateHandler: Handler<{}, '', {
  in: {
    json: UserCreate
  };
  out: {
    json: UserCreate;
  };
}> = (c) => {
  try {
    const data = c.req.valid('json');

    const {
      name,
      email,
      password,
    } = data;

    const id = uuidv4();


    return c.json({
      success: true,
      data: 'createdUser',
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const userReadHandler: Handler<{}, '', {}> = async (c) => {
  const db = await createDbConnection();
  const result = await db.all('SELECT * FROM users', []);

  return c.json({ success: true, result }, 200);
};
