import { z } from 'zod';

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  operations: z.array(
    z.object({
      accountId: z.string().optional(),
      sum: z.string().optional(),
    }),
  ),
});

export const createTemplateSchema = templateSchema;
export const updateTemplateSchema = templateSchema.partial().required({ id: true });
export const deleteTemplateSchema = templateSchema.pick({ id: true });
