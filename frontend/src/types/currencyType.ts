import { z } from 'zod';

import {
  createCurrencySchema,
  currencySchema,
  deleteCurrencySchema,
  setMainCurrencySchema,
  updateCurrencySchema,
} from '#schema/currencySchema';

export type Currency = z.infer<typeof currencySchema>;
export type CreateCurrencyData = z.infer<typeof createCurrencySchema>;
export type UpdateCurrencyData = z.infer<typeof updateCurrencySchema>;
export type DeleteCurrencyData = z.infer<typeof deleteCurrencySchema>;
export type SetMainCurrencyData = z.infer<typeof setMainCurrencySchema>;

export type CurrencyType = Currency['type'];
