import { OpenAPIHono } from "@hono/zod-openapi";
import bcrypt from "bcrypt";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { User } from "../user/model";
import { loginRoute, logoutRoute, registerRoute } from "./routes";

export const authApp = new OpenAPIHono({
  defaultHook: (result) => {
    if (!result.success && result.error.issues.length > 0) {
      throw new CustomHttpException(result.error.issues[0].message, 400);
    }
  },
});

const tokenLifetime = 8 * 60 ** 2 * 1000;

authApp.openapi(registerRoute, async (c) => {
  const { email, password, username } = c.req.valid("form");

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    throw new CustomHttpException("User already exist", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  if (!process.env.JWT_SECRET)
    throw new Error("process.env.JWT_SECRET is required");

  // eslint-disable-next-line
  const token = await sign({ id: user._id }, process.env.JWT_SECRET);

  setCookie(c, "token", token, {
    maxAge: tokenLifetime,
    httpOnly: true,
  });

  return c.json({ token }, 200);
});

authApp.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("form");

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomHttpException("User does not exist", StatusCodes.GONE);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomHttpException(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (!process.env.JWT_SECRET)
    throw new Error("process.env.JWT_SECRET is required");

  const token = await sign({ id: user._id }, process.env.JWT_SECRET);

  const expirationDate = new Date(new Date().getTime() + tokenLifetime);

  setCookie(c, "token", token, {
    maxAge: tokenLifetime,
    expires: expirationDate,
    httpOnly: true,
    path: "/",
  });

  return c.json({ token }, 200);
});

authApp.openapi(logoutRoute, async (c) => {
  deleteCookie(c, "token", {
    path: "/",
  });
  return c.json({}, StatusCodes.NO_CONTENT)
});
