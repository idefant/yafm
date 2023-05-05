import { string } from 'yup';

import { checkValidPrice } from '../helper/currencies';

export const numberWithDecimalPlacesSchema = (decimalPlaces: number, required = false) =>
  string().test((value = '') => {
    const croppedValue = value.replaceAll(' ', '');
    return (
      checkValidPrice(croppedValue, decimalPlaces) &&
      (required ? parseFloat(croppedValue) > 0 : true)
    );
  });
