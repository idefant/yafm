import { z } from 'zod';

import {
  createAccountGroupSchema,
  updateAccountGroupSchema,
  deleteAccountGroupSchema,
} from './accountGroupSchema';
import { createAccountSchema, updateAccountSchema, deleteAccountSchema } from './accountSchema';
import { baseSchema } from './baseSchema';
import { createCategorySchema, updateCategorySchema, deleteCategorySchema } from './categorySchema';
import {
  setMainCurrencySchema,
  createCurrencySchema,
  updateCurrencySchema,
  deleteCurrencySchema,
} from './currencySchema';
import { createTemplateSchema, updateTemplateSchema, deleteTemplateSchema } from './templateSchema';
import {
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
} from './transactionSchema';

export const commitActionSchema = z.union([
  // === Currency ===
  z.object({
    method: z.literal('set_main_currency'),
    data: setMainCurrencySchema,
  }),
  z.object({
    method: z.literal('create_currency'),
    data: createCurrencySchema,
  }),
  z.object({
    method: z.literal('update_currency'),
    data: updateCurrencySchema,
  }),
  z.object({
    method: z.literal('delete_currency'),
    data: deleteCurrencySchema,
  }),

  // === Account Group ===
  z.object({
    method: z.literal('create_account_group'),
    data: createAccountGroupSchema,
  }),
  z.object({
    method: z.literal('update_account_group'),
    data: updateAccountGroupSchema,
  }),
  z.object({
    method: z.literal('delete_account_group'),
    data: deleteAccountGroupSchema,
  }),

  // === Account ===
  z.object({
    method: z.literal('create_account'),
    data: createAccountSchema,
  }),
  z.object({
    method: z.literal('update_account'),
    data: updateAccountSchema,
  }),
  z.object({
    method: z.literal('delete_account'),
    data: deleteAccountSchema,
  }),

  // === Category ===
  z.object({
    method: z.literal('create_category'),
    data: createCategorySchema,
  }),
  z.object({
    method: z.literal('update_category'),
    data: updateCategorySchema,
  }),
  z.object({
    method: z.literal('delete_category'),
    data: deleteCategorySchema,
  }),

  // === Template ===
  z.object({
    method: z.literal('create_template'),
    data: createTemplateSchema,
  }),
  z.object({
    method: z.literal('update_template'),
    data: updateTemplateSchema,
  }),
  z.object({
    method: z.literal('delete_template'),
    data: deleteTemplateSchema,
  }),

  // === Transaction ===
  z.object({
    method: z.literal('create_transaction'),
    data: createTransactionSchema,
  }),
  z.object({
    method: z.literal('update_transaction'),
    data: updateTransactionSchema,
  }),
  z.object({
    method: z.literal('delete_transaction'),
    data: deleteTransactionSchema,
  }),

  // === Base ===
  z.object({
    method: z.literal('init_base'),
    data: baseSchema,
  }),
  z.object({
    method: z.literal('import_base'),
    data: baseSchema,
  }),
  z.object({
    method: z.literal('change_password'),
    data: baseSchema,
  }),
]);

export const commitSchema = z.object({
  createdAt: z.number().int().nonnegative(),
  nonce: z.string(),
  actions: z.array(commitActionSchema),
});
