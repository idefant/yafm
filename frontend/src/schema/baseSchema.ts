import { z } from 'zod';

import { accountGroupSchema } from './accountGroupSchema';
import { accountSchema } from './accountSchema';
import { categorySchema } from './categorySchema';
import { currencySchema } from './currencySchema';
import { templateSchema } from './templateSchema';
import { transactionSchema } from './transactionSchema';

export const baseSchema = z.object({
  currencies: z.array(currencySchema),
  mainCurrencyCode: z.string(),
  accountGroups: z.array(accountGroupSchema),
  accounts: z.array(accountSchema),
  categories: z.array(categorySchema),
  templates: z.array(templateSchema),
  transactions: z.array(transactionSchema),
});

export const baseFileSchema = z.object({
  createdAt: z.number().int().nonnegative(),
  isEncrypted: z.boolean(),
  data: z.any(),
});
