import { OpenAPIHono } from "@hono/zod-openapi";
import { deleteCookie, setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";
import { defaultHook, handleLogin, handleRegister } from "./handlers";
import { loginRoute, logoutRoute, registerRoute } from "./routes";

export const authApp = new OpenAPIHono({
  defaultHook,
});

authApp.openapi(registerRoute, async (c) => {
  const { email, password, username } = c.req.valid("form");

  const { token } = await handleRegister({
    email,
    password,
    username,
  });

  setCookie(c, "token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });

  return c.json({ token }, StatusCodes.CREATED);
});

authApp.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("form");

  const { token } = await handleLogin({ email, password });

  setCookie(c, "token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });

  return c.json({ token }, StatusCodes.OK);
});

authApp.openapi(logoutRoute, async (c) => {
  deleteCookie(c, "token", {
    path: "/",
  });
  return c.json({}, StatusCodes.NO_CONTENT);
});
