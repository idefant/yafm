import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency_code: z.string(),
  category_id: z.string().optional(),
  is_archive: z.boolean().optional(),
});
