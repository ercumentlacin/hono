import { verify } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { CustomHttpException } from "../../helpers/CustomHttpException";

export const animeGetListSchema = z.object({
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
});

export const animeInsertSchema = z.object({
  malId: z.coerce.number({
    required_error: "malId is required",
  }),
  title: z.string({
    required_error: "title is required",
  }),
  imageUrl: z.string().optional().default("asd"),
  lastCheckedEpisodeNumber: z.coerce.number().optional(),
  lastCheckedEpisodeDate: z.coerce.date().optional(),
});
