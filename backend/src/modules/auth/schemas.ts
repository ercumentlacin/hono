import { z } from "zod";

const required_error = (context: string) => `${context} is required`;

export const authSchemaRegister = z.object({

    name: z.string({
        required_error: required_error('Name'),
    }),

    email: z.string({
        required_error: required_error('Email')
    })
    .email('Please enter a valid email'),

    password: z.string({
        required_error: required_error('Password')
    })

})

export const authSchemaLogin = authSchemaRegister.omit({ name: true });