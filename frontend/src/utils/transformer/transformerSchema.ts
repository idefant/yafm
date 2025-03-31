import { z } from 'zod';

import { transforms } from './transformerType';

export const transformedDataSchema = z.object({
  data: z.string(),
  transforms: z.array(z.enum(transforms)),
});
