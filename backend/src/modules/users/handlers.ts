import { Handler } from "hono/dist/types/types";
import { User, UserCreate } from "./types";
import { uuidv4 } from "../../helpers/uuidv4";
import { sql } from "../../db/sql";
import { createDbConnection } from "../../db";
import { getSignedCookie } from "hono/cookie";

export const userCreateHandler: Handler<{}, "", {
    in: {
        json: UserCreate
    };
    out: {
        json: UserCreate;
    };
}> = (c) => {
    try {
        const data = c.req.valid('json')

        const {
            name,
            email,
            password
        } = data;

        const id = uuidv4();

        const createdUser = sql`INSERT INTO "Users" (name, email, password, id) VALUES(${name}), ${email}, ${password}, ${id}`;

        return c.json({
            success: true,
            data: createdUser
        }, 201)
    } catch (error) {
        console.log(error)
        return c.json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const userReadHandler: Handler<{}, "", {}> = async (c) => {
    try {
        const payload = await getSignedCookie(c, process.env.COOKIE_SECRET as string, 'auth_token')
        console.log({ payload })
        const db = await createDbConnection();
        const result = await db.all('SELECT * FROM users', []);

        return c.json({ success: true, result }, 200)
    } catch (error) {
        console.log({ error })
    }
}