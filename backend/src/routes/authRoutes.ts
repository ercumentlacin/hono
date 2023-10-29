import {  zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authSchemaLogin, authSchemaRegister } from "../modules/auth/schemas";
import { authRegisterHandler, authLoginHandler } from "../modules/auth/handlers";
import { CustomHttpException } from "../helpers/CustomHttpException";

export const authRoutes = new Hono();

authRoutes.post('/register', zValidator("json", authSchemaRegister, (result, c) => {
    if (!result.success) {
        throw new CustomHttpException(
            400,
            result.error.issues[0].message
        )
    }
}), authRegisterHandler)

authRoutes.post('/login', zValidator("json", authSchemaLogin, (result, c) => {
    if (!result.success) {
        throw new CustomHttpException(
            400,
            result.error.issues[0].message
        )
    }
}), authLoginHandler)