import { object, string } from 'yup';

import { currencyTypes } from '#types/currencyType';

export const currencySchema = object().shape({
  code: string().required(),
  name: string().required(),
  decimal_places_number: string().required(),
  type: string().oneOf(currencyTypes).required(),
  color: string().required(),
  symbol: string().required(),
});
