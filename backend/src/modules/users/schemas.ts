import { z } from "zod";

export const userCreateSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),

    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string"
    })
        .email("Email is should be valid"),

    password: z.string({
        required_error: "Password is required",
    })
})

export const userSchema = userCreateSchema.extend({
    id: z.string()
})