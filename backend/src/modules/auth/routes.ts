import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { ErrorSchema, authLoginSchema, authRegisterSchema } from "./schemas";

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/x-www-form-urlencoded": {
          schema: authRegisterSchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({ token: z.string() }),
        },
      },
      description: "Retrieve the user",
      headers: {
        "Set-Cookie": {
          schema: {
            type: "string",
            example: "token=abcde12345; Path=/; HttpOnly",
          },
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },

    [StatusCodes.CONFLICT]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});

export const loginRoute = createRoute({
  tags: ["auth"],
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/x-www-form-urlencoded": {
          schema: authLoginSchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.object({ token: z.string() }),
        },
      },
      description: "Retrieve the user",
      headers: {
        "Set-Cookie": {
          schema: {
            type: "string",
            example: "token=abcde12345; Path=/; HttpOnly",
          },
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },

    [StatusCodes.UNAUTHORIZED]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },

    [StatusCodes.GONE]: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});

export const logoutRoute = createRoute({
  tags: ["auth"],
  method: "post",
  path: "/log-out",
  request: {},
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description: "Delete 'token' from cookies",
    },
  },
});
