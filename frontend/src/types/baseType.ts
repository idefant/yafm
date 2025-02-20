import { Except } from 'type-fest';
import { z } from 'zod';

import { baseFileSchema, baseSchema } from '#schema/baseSchema';

import { EncryptedData } from './cipherType';

export type Base = z.infer<typeof baseSchema>;

export type BaseFileData = Except<z.infer<typeof baseFileSchema>, 'data' | 'isEncrypted'> &
  (
    | {
        data: EncryptedData;
        isEncrypted: true;
      }
    | {
        data: any;
        isEncrypted: false;
      }
  );
