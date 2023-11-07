import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { authLoginSchema, authRegisterSchema } from "./schemas";
import { User } from "../user/model";

export const authRoutes = new Hono();

authRoutes.post(
  "register",
  zValidator("form", authRegisterSchema, (result) => {
    if (!result.success && result.error.issues.length > 0) {
      throw new CustomHttpException(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const { email, password, username } = c.req.valid("form");

    const userExists = await User.findOne({ email });
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

    return c.json({ token }, 200);
  }
);

authRoutes.post(
  "login",
  zValidator("form", authLoginSchema, (result) => {
    if (!result.success && result.error.issues.length > 0) {
      throw new CustomHttpException(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const { email, password } = c.req.valid("form");

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomHttpException(
        "User does not exist",
        StatusCodes.UNAUTHORIZED
      );
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

    const token = sign({ id: user._id }, process.env.JWT_SECRET);
    return c.json({ token }, 200);
  }
);
