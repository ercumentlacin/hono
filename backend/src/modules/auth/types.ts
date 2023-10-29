import { z } from 'zod';
import { authSchemaLogin, authSchemaRegister } from './schemas';

export type AuthCreate = z.infer<typeof authSchemaRegister>;
export type AuthLogin = z.infer<typeof authSchemaLogin>;
