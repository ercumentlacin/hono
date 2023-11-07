import { z } from "zod";

export const authRegisterSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(1, "Username is required"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
});

export const authLoginSchema = authRegisterSchema.pick({
    email: true,
    password: true,
})