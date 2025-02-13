import { z } from 'zod';

import { hexSchema } from './commonSchema';

export const getListCommitsSchema = z.object({
  syncedAtFrom: z.string().datetime().optional(),
});

export const createCommitSchema = z.object({
  iv: hexSchema,
  cipher: z.string().base64(),
  hmac: hexSchema,
  salt: hexSchema,
});
