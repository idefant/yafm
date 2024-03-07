import { object, string, number, array } from 'yup';

export const transferSchema = object({
  account_id: string().required(),
  sum: string().required(),
});

export const transactionSchema = object().shape({
  id: string().required(),
  name: string(),
  description: string(),
  datetime: number().required().integer(),
  operations: array(transferSchema).required(),
  category_id: string(),
});

export const templateSchema = object().shape({
  id: string().required(),
  name: string(),
  description: string(),
  operations: array(transferSchema).required(),
  category_id: string(),
});
