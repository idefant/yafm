import { z } from 'zod';

export const passwordSchema = z
  .string()
  .nonempty()
  .min(8, 'Длина пароля должны быть не менее 8 символов')
  .refine((password) => /\p{Lu}/u.test(password), 'Пароль должен содержать заглавные буквы')
  .refine((password) => /\p{Ll}/u.test(password), 'Пароль должен содержать строчные буквы')
  .refine((password) => /\d/.test(password), 'Пароль должен содержать цифры')
  .refine(
    (password) => /[`~!@#$%^&*()\-_=+"'/\\|,.<>?:;[\]{}№]/.test(password),
    'Пароль должен содержать спецсимволы',
  );
