import { z } from 'zod';

const createRequiredErrorMessage = (context: string) => `${context} is required`;

export const authSchemaRegister = z.object({

  name: z.string({
    required_error: createRequiredErrorMessage('Name'),
  }),

  email: z.string({
    required_error: createRequiredErrorMessage('Email'),
  })
    .email('Please enter a valid email'),

  password: z.string({
    required_error: createRequiredErrorMessage('Password'),
  }),

});

export const authSchemaLogin = authSchemaRegister.omit({ name: true });
