import { z } from 'zod';

export const hexSchema = z
  .string()
  .nonempty()
  .refine((value) => /^[0-9a-f]*$/i.test(value), 'Value must be in hex format');
