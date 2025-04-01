import { z } from 'zod';

export const accountGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
});

export const createAccountGroupSchema = accountGroupSchema;
export const updateAccountGroupSchema = accountGroupSchema.partial().required({ id: true });
export const deleteAccountGroupSchema = accountGroupSchema.pick({ id: true });
