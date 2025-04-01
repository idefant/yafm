import { z } from 'zod';

export const currencyTypes = ['fiat', 'crypto'] as const;

export const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
  decimalPlaces: z.number().int().nonnegative(),
  type: z.enum(currencyTypes),
  color: z.string(),
  symbol: z.string(),
  description: z.string().nullish(),
});

export const createCurrencySchema = currencySchema;
export const updateCurrencySchema = currencySchema.partial().required({ code: true });
export const deleteCurrencySchema = currencySchema.pick({ code: true });
export const setMainCurrencySchema = z.object({ code: z.string() });
