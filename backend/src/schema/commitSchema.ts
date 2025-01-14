import { object, date } from 'yup';

import { base64Schema, hexSchema } from './commonSchema';

export const getListCommitsSchema = object().shape({
  syncedAtFrom: date(),
});

export const createCommitSchema = object().shape({
  iv: hexSchema.required(),
  cipher: base64Schema.required(),
  hmac: hexSchema.required(),
  salt: hexSchema.required(),
});
