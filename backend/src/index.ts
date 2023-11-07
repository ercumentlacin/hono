import "@total-typescript/ts-reset";

import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { CustomHttpException } from "./helpers/CustomHttpException";
import { authRoutes } from "./modules/auth/route";
import { animeRoutes } from "./modules/anime/route";

if (!process.env.MONGO_URL) throw new Error("MONGO_URL not founded");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const app = new Hono();
app.use("/api/*", cors());
app.use("*", logger());

app.route("/api/auth", authRoutes);
app.route("/api/anime", animeRoutes);

app.notFound((c) => c.text("Custom 404 Message", 404));

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

serve(app);
