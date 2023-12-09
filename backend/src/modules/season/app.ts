/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenAPIHono } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { searchSeasonOnMAL } from "../../services";
import { seasonListRoute } from "./routes";

export const seasonApp = new OpenAPIHono({});

seasonApp.openapi(seasonListRoute, async (c) => {
  const seasonList = await searchSeasonOnMAL();

  return c.json(seasonList, StatusCodes.OK);
});
