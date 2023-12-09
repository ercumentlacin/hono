import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { seasonSchema } from "./schema";

export const seasonListRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["season"],
  description: "Return season list",
  request: {},
  parameters: [],
  responses: {
    [StatusCodes.OK]: {
      content: {
        "application/json": {
          schema: z.array(seasonSchema)
        },
      },
      description: "Returns season list",
    },
  },
});
