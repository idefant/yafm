import { object, string, number, boolean } from "yup";

export const accountSchema = object().shape({
  id: string().required(),
  name: string().required(),
  balance: number().integer().required(),
  start_balance: number().integer().required(),
  currency_code: string().required(),
  category_id: string(),
  is_hide: boolean(),
  is_archive: boolean(),
});
