/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { jwt, verify } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { AnimeList } from "./model";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { animeGetListSchema, animeInsertSchema } from "./schema";

export const animeRoutes = new Hono();

// animeRoutes.use("*", zValidator("header", animeGetListSchema), (c, next) => {
//   if (!process.env.JWT_SECRET)
//     throw new Error("process.env.JWT_SECRET is required");

//   return jwt({
//     secret: process.env.JWT_SECRET,
//   })(c, next);
// });
animeRoutes.use("*", async (c, next) => {
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
});

animeRoutes.get("list", async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const animeList = await AnimeList.findOne({ user: userId });

  if (!animeList) {
    throw new CustomHttpException(
      "Anime list not found",
      StatusCodes.GONE
    );
  }

  return c.json({ data: animeList }, 200);
});

animeRoutes.post(
  "add",
  zValidator("json", animeInsertSchema, (result) => {
    if (!result.success && result.error.issues.length > 0) {
      throw new CustomHttpException(result.error.issues[0].message, 400);
    }
  }),
  async (c) => {
    const { id: userId } = c.get("jwtPayload");
    const { malId, title, imageUrl } = c.req.valid("json");

    let animeList = await AnimeList.findOne({ user: userId });
    if (!animeList) {
      animeList = new AnimeList({ user: userId, animes: [] });
    }

    const animeExists = animeList.animes.find((anime) => anime.malId === malId);
    if (animeExists) {
      throw new CustomHttpException(
        "Anime already in list",
        StatusCodes.CONFLICT
      );
    }

    animeList.animes.push({ malId, title, imageUrl });
    await animeList.save();

    return c.json(
      {
        data: animeList,
      },
      StatusCodes.CREATED
    );
  }
);
