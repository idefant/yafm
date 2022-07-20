import { string } from 'yup';

import { checkValidPrice } from '../helper/currencies';

export const numberWithDecimalPlacesSchema = (decimalPlaces: number, required = false) => (
  string().test((value = '') => checkValidPrice(value, decimalPlaces)
      && (required ? parseFloat(value) > 0 : true))
);
