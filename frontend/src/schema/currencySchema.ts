import { z } from 'zod';

import { currencyTypes } from '#types/currencyType';

export const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
  decimal_places_number: z.string(),
  type: z.enum(currencyTypes),
  color: z.string(),
  symbol: z.string(),
});
