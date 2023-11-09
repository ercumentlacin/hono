import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { CustomHttpException } from "../../helpers/CustomHttpException";

export const authenticateToken = async <C extends Context>(
  c: C,
  next: Next
) => {
  console.log("hi");
  const token = getCookie(c, "token");

  if (!token) {
    throw new CustomHttpException("Token not found", StatusCodes.UNAUTHORIZED);
  }

  if (!process.env.JWT_SECRET)
    throw new Error("process.env.JWT_SECRET is required");

  const payload = await verify(token, process.env.JWT_SECRET);

  if (!payload) {
    throw new CustomHttpException(
      "Token is invalid found",
      StatusCodes.UNAUTHORIZED
    );
  }

  c.set("jwtPayload", payload);

  await next();
};
