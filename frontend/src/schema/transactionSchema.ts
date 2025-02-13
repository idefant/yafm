import { z } from 'zod';

export const operationSchema = z.object({
  account_id: z.string(),
  sum: z.string(),
});

export const transactionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  datetime: z.number().int().positive(),
  operations: z.array(operationSchema),
  category_id: z.string().optional(),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  operations: z.array(operationSchema),
  category_id: z.string().optional(),
});
