import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import "@total-typescript/ts-reset";
import "dotenv/config";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from "hono/secure-headers";
import { StatusCodes } from "http-status-codes";
import { CustomHttpException } from "./helpers/CustomHttpException";
import "./helpers/animeUpdatesCron";
import { checkForNewEpisodesAndNotify } from "./helpers/checkForNewEpisodesAndNotify";
import { connectToDatabase } from "./helpers/database";
import { animeApp } from "./modules/anime/app";
import { authApp } from "./modules/auth/app";
import { seasonApp } from "./modules/season/app";

connectToDatabase();

const app = new OpenAPIHono();

app.use('*', prettyJSON())
app.use("/api/*", cors());
app.use("*", logger());
app.use("*", compress());
app.use("*", secureHeaders());

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  })
);
app.route("/api/auth", authApp);
app.route("/api/anime", animeApp);
app.route("/api/season", seasonApp);

checkForNewEpisodesAndNotify();

app.notFound((c) => c.text("Custom 404 Message", StatusCodes.NOT_FOUND));

app.onError((err, c) => {
  if (
    process.env.NODE_ENV !== "test" &&
    process.env.NODE_ENV !== "production"
  ) {
    console.error({ err });
  }

  console.error({ err });


  let message = "something went wrong";
  let status = 500;

  if (err instanceof CustomHttpException) {
    message = err.message;
    status = err.status;
  }

  return c.json(
    {
      success: false,
      message,
    },
    status
  );
});

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
});

app.showRoutes();

serve(app);

export { app };
