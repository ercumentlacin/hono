/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { decode, jwt, verify } from "hono/jwt";
import { AnimeList } from "./model";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const animeRoutes = new Hono();

animeRoutes.use(
  "*",
  zValidator(
    "header",
    z.object({
      authorization: z
        .string({
          required_error: "you should be register",
        })
        .refine(async (authorization) => {
          if (!authorization)
            throw new CustomHttpException(
              "Token not found",
              StatusCodes.UNAUTHORIZED
            );

          try {
            const [, token] = authorization.split(" ");

            if (!process.env.JWT_SECRET)
              throw new Error("process.env.JWT_SECRET is required");

            const result = await verify(token, process.env.JWT_SECRET);
            console.log("result", result);
            return true;
          } catch (error) {
            console.log("error", error);
            if (error instanceof Error) {
              throw new CustomHttpException(error.message, 400);
            }
            return false;
          }
        }),
    })
  ),
  (c, next) => {
    if (!process.env.JWT_SECRET)
      throw new Error("process.env.JWT_SECRET is required");

    return jwt({
      secret: process.env.JWT_SECRET,
    })(c, next);
  }
);

animeRoutes.get("list", async (c) => {
  const { id: userId } = c.get("jwtPayload");
  // const { userId } = req.body; // JWT'den alınan kullanıcı id'si kullanılabilir
  const animeList = await AnimeList.findOne({ user: userId });

  if (!animeList) {
    throw new CustomHttpException(
      "Anime list not found",
      StatusCodes.NOT_FOUND
    );
  }

  return c.json({ data: animeList }, 200);
});
