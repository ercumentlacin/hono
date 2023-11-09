import "@total-typescript/ts-reset";

import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import "dotenv/config";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { CustomHttpException } from "./helpers/CustomHttpException";
import { animeApp } from "./modules/anime/app";
import { authApp } from "./modules/auth/app";

if (!process.env.MONGO_URL) throw new Error("MONGO_URL not founded");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const app = new OpenAPIHono();

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

app.notFound((c) => c.text("Custom 404 Message", StatusCodes.NOT_FOUND));

app.onError((err, c) => {
  console.error({ err });
  console.log("err.message", err);

  console.log("err instanceof ZodError", err instanceof ZodError);

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

serve(app);
