import { z } from 'zod';

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  categoryId: z.string().nullish(),
  operations: z.array(
    z.object({
      accountId: z.string().nullish(),
      sum: z.string().nullish(),
    }),
  ),
});

export const createTemplateSchema = templateSchema;
export const updateTemplateSchema = templateSchema.partial().required({ id: true });
export const deleteTemplateSchema = templateSchema.pick({ id: true });
