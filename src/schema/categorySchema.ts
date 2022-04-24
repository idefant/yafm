import { object, string, boolean } from "yup";

export const categorySchema = object().shape({
  id: string().required(),
  name: string().required(),
  is_hide: boolean(),
  is_archive: boolean(),
});
