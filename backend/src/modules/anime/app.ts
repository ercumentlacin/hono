/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenAPIHono } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { searchAnimeOnMAL } from "../../services";
import { authenticateToken } from "../../shared/middleware/auth";
import { AnimeList } from "./model";
import {
  animeDeleteRoute,
  animeInsertRoute,
  animeListRoute,
  animeSearchRoute,
} from "./routes";

export const animeApp = new OpenAPIHono({
  defaultHook: (result) => {
    if (!result.success && result.error.issues.length > 0) {
      throw new CustomHttpException(result.error.issues[0].message, 400);
    }
  },
});

animeApp.use("*", authenticateToken);

animeApp.openapi(animeListRoute, async (c) => {
  const { id: userId } = c.get("jwtPayload");
  console.log({ userId });
  const animeList = await AnimeList.findOne({ user: userId });

  if (!animeList) {
    console.log("noluyo");
    throw new CustomHttpException("Anime list not found", StatusCodes.GONE);
  }

  return c.json({ data: animeList.animes }, 200);
});

animeApp.openapi(animeInsertRoute, async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const {
    malId,
    title,
    imageUrl,
    lastCheckedEpisodeDate,
    lastCheckedEpisodeNumber,
  } = c.req.valid("json");

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

  animeList.animes.push({
    malId,
    title,
    imageUrl,
    lastCheckedEpisodeDate: lastCheckedEpisodeDate || new Date(),
    lastCheckedEpisodeNumber: lastCheckedEpisodeNumber || 0,
  });

  const { _id } = await animeList.save();

  return c.json(
    {
      data: _id,
    },
    StatusCodes.CREATED
  );
});

animeApp.openapi(animeDeleteRoute, async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const { malId } = c.req.valid("json");

  let animeList = await AnimeList.findOne({ user: userId });
  if (!animeList) {
    animeList = new AnimeList({ user: userId, animes: [] });
  }

  const animeExists = animeList.animes.find((anime) => anime.malId === malId);
  if (!animeExists) {
    throw new CustomHttpException("Anime not found", StatusCodes.GONE);
  }

  const excludedAnime = animeList.animes.filter(
    (anime) => anime.malId !== malId
  );
  animeList.animes = excludedAnime;
  await animeList.save();

  return c.json({}, StatusCodes.NO_CONTENT);
});

animeApp.openapi(animeSearchRoute, async (c) => {
  const { query } = c.req.query();

  const results = await searchAnimeOnMAL(query);

  return c.json({ data: results }, 200);
});
