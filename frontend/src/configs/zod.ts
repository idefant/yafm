import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === 'invalid_type') {
    return { message: '' };
  }
  if (issue.code === 'too_small' && issue.minimum === 1) {
    return { message: '' };
  }
  return { message: ctx.defaultError };
};

export const configureZod = () => {
  z.setErrorMap(customErrorMap);
};
