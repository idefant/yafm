import { z } from 'zod';

import {
  accountGroupSchema,
  createAccountGroupSchema,
  deleteAccountGroupSchema,
  updateAccountGroupSchema,
} from '#schema/accountGroupSchema';

export type AccountGroup = z.infer<typeof accountGroupSchema>;
export type CreateAccountGroupData = z.infer<typeof createAccountGroupSchema>;
export type UpdateAccountGroupData = z.infer<typeof updateAccountGroupSchema>;
export type DeleteAccountGroupData = z.infer<typeof deleteAccountGroupSchema>;
