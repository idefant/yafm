import { object, string, boolean } from 'yup';

export const accountSchema = object().shape({
  id: string().required(),
  name: string().required(),
  currency_code: string().required(),
  category_id: string(),
  is_archive: boolean(),
});
