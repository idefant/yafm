import { object, string, number } from "yup";

import {
  checkNeedIncome,
  checkNeedOutcome,
  transactionTypes,
  TTransactionType,
} from "../types/transactionType";

export const transferSchema = object({
  account_id: string().required(),
  sum: number().required().integer(),
});

export const transactionSchema = object().shape({
  id: string().required(),
  name: string(),
  description: string(),
  datetime: number().required().integer(),
  type: string().required().oneOf(transactionTypes),
  income: transferSchema.when("type", {
    is: (value: TTransactionType) => checkNeedIncome(value),
    otherwise: (schema) => schema.default(undefined),
  }),
  outcome: transferSchema.when("type", {
    is: (value: TTransactionType) => checkNeedOutcome(value),
    otherwise: (schema) => schema.default(undefined),
  }),
  category_id: string(),
});

export const templateSchema = object().shape({
  id: string().required(),
  name: string(),
  description: string(),
  type: string().required().oneOf(transactionTypes),
  income: transferSchema.when("type", {
    is: (value: TTransactionType) => checkNeedIncome(value),
    otherwise: (schema) => schema.default(undefined),
  }),
  outcome: transferSchema.when("type", {
    is: (value: TTransactionType) => checkNeedOutcome(value),
    otherwise: (schema) => schema.default(undefined),
  }),
  category_id: string(),
});
