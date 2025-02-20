import { Except, Simplify } from 'type-fest';
import { z } from 'zod';

import {
  accountSchema,
  createAccountSchema,
  deleteAccountSchema,
  updateAccountSchema,
} from '#schema/accountSchema';

import { AccountGroup } from './accountGroupType';
import { Currency } from './currencyType';

export type Account = z.infer<typeof accountSchema>;
export type CreateAccountData = z.infer<typeof createAccountSchema>;
export type UpdateAccountData = z.infer<typeof updateAccountSchema>;
export type DeleteAccountData = z.infer<typeof deleteAccountSchema>;

export type AccountExtended = Simplify<
  Except<Account, 'groupId'> & {
    currency: Currency;
  }
> &
  (
    | {
        groupId: Required<Account['groupId']>;
        group: AccountGroup;
      }
    | {
        groupId?: undefined;
        group?: undefined;
      }
  );
