import { z } from 'zod';

import {
  categorySchema,
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from '#schema/categorySchema';

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryData = z.infer<typeof deleteCategorySchema>;
