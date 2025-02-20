import { Except, Simplify } from 'type-fest';
import { z } from 'zod';

import {
  createTransactionSchema,
  deleteTransactionSchema,
  transactionSchema,
  updateTransactionSchema,
} from '#schema/transactionSchema';

import { AccountExtended } from './accountType';
import { Category } from './categoryType';

export type TransactionType = 'income' | 'outcome' | 'exchange';

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransactionData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionData = z.infer<typeof deleteTransactionSchema>;

type Operation = Transaction['operations'][number];

export type OperationExtended = Simplify<
  Operation & {
    account: AccountExtended;
  }
>;

export type TransactionExtended = Simplify<
  Except<Transaction, 'operations' | 'categoryId'> & {
    operations: OperationExtended[];
  }
> &
  (
    | {
        categoryId: Transaction['categoryId'];
        category: Category;
      }
    | {
        categoryId?: undefined;
        category?: undefined;
      }
  );
