import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { CustomHttpException } from "../helpers/CustomHttpException";
import { userCreateHandler, userReadHandler } from "../modules/users/handlers";
import { userCreateSchema } from "../modules/users/schemas";
import { jwt } from "hono/jwt";
import { bearerAuth } from 'hono/bearer-auth'

export const userRoutes = new Hono();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOTVhYzVkMi03ZjAzLTRjYjUtYTQ2NC02YzM3YzRiOWQ4YmMiLCJyb2xlIjoidXNlciJ9.NuLe__Hr9dytblnWiJykaoQv0D2a-n6qn6pHXHNdB3o'

userRoutes.use(
    '*',
    (c, next) => {

      const authorization = c.req.header('authorization');
      const token = authorization?.split(' ').pop() || 'token not found'

      return bearerAuth({ token })(c, next)
    }
  )

userRoutes.get('', userReadHandler)

userRoutes.post('', zValidator(
    "json",
    userCreateSchema,
    (result, c) => {
        if (!result.success) {
            throw new CustomHttpException(
                400,
                result.error.issues[0].message
            )
        }
    }
), userCreateHandler)
