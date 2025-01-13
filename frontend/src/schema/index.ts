import { string } from 'yup';

export const numberWithDecimalPlacesSchema = (decimalPlaces: number, required = false) =>
  string().test((value = '') => {
    const croppedValue = value.replaceAll(' ', '');
    return (
      new RegExp(`^\\d+(\\.|,)?\\d{0,${decimalPlaces}}$`).test(croppedValue) &&
      (required ? parseFloat(croppedValue) > 0 : true)
    );
  });
