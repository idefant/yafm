import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  datetime: z.number().int().nonnegative(),
  categoryId: z.string().optional(),
  operations: z
    .array(
      z.object({
        accountId: z.string(),
        sum: z.string(),
      }),
    )
    .min(1),
});

export const createTransactionSchema = transactionSchema;
export const updateTransactionSchema = transactionSchema.partial().required({ id: true });
export const deleteTransactionSchema = transactionSchema.pick({ id: true });
