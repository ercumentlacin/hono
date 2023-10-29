import { Handler } from 'hono';
import bcrypt from 'bcryptjs';
import {
  StatusCodes,
} from 'http-status-codes';
import { sign } from 'hono/jwt';
import { env } from 'hono/adapter';
import {
  setCookie,
} from 'hono/cookie';
import { CustomHttpException } from '../../helpers/CustomHttpException';
import { createDbConnection } from '../../db';
import { uuidv4 } from '../../helpers/uuidv4';
import { AuthCreate, AuthLogin } from './types';

type AuthHandlerRegister = Handler<{
}, '', {
  in: { json: AuthCreate },
  out: { json: AuthCreate },
}>;
type AuthHandlerLogin = Handler<{}, '', {
  in: { json: AuthLogin },
  out: { json: AuthLogin },
}>;

export const authRegisterHandler: AuthHandlerRegister = async (c, next) => {
  try {
    const data = c.req.valid('json');

    const { name: userName, email: userEmail, password } = data;

    const salt = bcrypt.genSaltSync(10);
    const userPassword = bcrypt.hashSync(password, salt);

    const userId = uuidv4();
    const db = await createDbConnection();
    await db
      .run(
        `
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL
                    )
                `,
      );

    await db
      .run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [userId, userName, userEmail, userPassword],
      );

    return c.json({
      success: true,
      result: userId,
    }, 201);
  } catch (error) {
    let status = 500;
    let message = 'Something went weong';

    if (error instanceof Error) {
      if (error.message.includes('SQLITE_CONSTRAINT')) {
        status = StatusCodes.CONFLICT;
        message = 'Email already taken';
      }
      throw new CustomHttpException(
        status,
        message,
      );
    }
    return next();
  }
};

export const authLoginHandler: AuthHandlerLogin = async (c, next) => {
  try {
    const db = await createDbConnection();

    const data = c.req.valid('json');
    const user = await db.get('SELECT * FROM users WHERE email = ?', data.email);

    if (!user) {
      throw new CustomHttpException(
        StatusCodes.NOT_FOUND,
        'No user found',
      );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    const { JWT_SECRET } = env<{ JWT_SECRET: string; COOKIE_SECRET: string }>(c);

    let token = '';
    if (isPasswordValid) {
      token = await sign(
        { userId: user.id, role: user.role ?? 'user' },
        JWT_SECRET,
      );
    } else {
      throw new CustomHttpException(
        StatusCodes.BAD_REQUEST,
        'Invalid password',
      );
    }

    setCookie(c, 'auth_token', token, {
      secure: true,
      httpOnly: false,
      path: '/anan',
    });

    return c.json({
      success: true,
      result: { token },
    }, 200);
  } catch (error) {
    return next();
  }
};
