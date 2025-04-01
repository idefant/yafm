import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  isArchived: z.boolean().nullish(),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial().required({ id: true });
export const deleteCategorySchema = categorySchema.pick({ id: true });
