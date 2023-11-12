import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ErrorSchema } from "../auth/schemas";
import { animeInsertSchema } from "./schema";

export const animeListRoute = createRoute({
  method: "get",
  path: "/list",
  tags: ["anime"],
  description: "Return anime list",
  request: {},
  parameters: [
    {
      name: "token",
      in: "cookie",
    },
  ],
  responses: {
    [StatusCodes.OK]: {
      content: {
        "application/json": {
          schema: animeInsertSchema.extend({
            _id: z.string().uuid(),
          }),
        },
      },
      description: "Returns anime list",
    },

    [StatusCodes.GONE]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Anime list not found 36",
    },
  },
});

export const animeInsertRoute = createRoute({
  method: "post",
  path: "/add",
  tags: ["anime"],
  description: "Add an anime on your list",
  parameters: [
    {
      name: "token",
      in: "cookie",
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: animeInsertSchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.CREATED]: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.string().uuid(),
          }),
        },
      },
      description: "Return inserted id",
    },

    [StatusCodes.GONE]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Anime list not found 79",
    },
    [StatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },
    [StatusCodes.CONFLICT]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Anime already in list",
    },
  },
});

export const animeSearchRoute = createRoute({
  method: "get",
  path: "/search",
  tags: ["anime"],
  description: "Search an anime",
  parameters: [
    {
      name: "token",
      in: "cookie",
    },
  ],
  request: {
    query: z.object({
      query: z.string(),
    }),
  },
  responses: {
    [StatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.string().uuid(),
          }),
        },
      },
      description: "Return inserted id",
    },

    [StatusCodes.GONE]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Anime list not found 79",
    },
    [StatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },
  },
});

export const animeDeleteRoute = createRoute({
  method: "delete",
  path: "/delete",
  tags: ["anime"],
  description: "Delete an anime on your list",
  parameters: [
    {
      name: "token",
      in: "cookie",
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: animeInsertSchema.pick({ malId: true }),
        },
      },
    },
  },
  responses: {
    [StatusCodes.NO_CONTENT]: {
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
      description: "Return no content",
    },

    [StatusCodes.GONE]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Anime list not found 79",
    },

    [StatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },
  },
});
