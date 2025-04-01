import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  currencyCode: z.string(),
  groupId: z.string().nullish(),
  isArchived: z.boolean().nullish(),
});

export const createAccountSchema = accountSchema;
export const updateAccountSchema = accountSchema.partial().required({ id: true });
export const deleteAccountSchema = accountSchema.pick({ id: true });
