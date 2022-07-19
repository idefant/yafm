import { string } from 'yup';

import { checkDecimalPlaces } from '../helper/currencies';

export const numberWithDecimalPlacesSchema = (decimalPlaces: number, required = false) => (
  string().test((value) => checkDecimalPlaces(value || '', decimalPlaces)
      && (required ? parseFloat(value || '') > 0 : true))
);
