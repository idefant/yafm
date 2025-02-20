import { Except, Simplify } from 'type-fest';
import { z } from 'zod';

import {
  createTemplateSchema,
  deleteTemplateSchema,
  templateSchema,
  updateTemplateSchema,
} from '#schema/templateSchema';

import { AccountExtended } from './accountType';
import { Category } from './categoryType';

export type Template = z.infer<typeof templateSchema>;
export type CreateTemplateData = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateData = z.infer<typeof updateTemplateSchema>;
export type DeleteTemplateData = z.infer<typeof deleteTemplateSchema>;

export type TemplateOperation = Template['operations'][number];

export type TemplateOperationExtended = Simplify<Except<TemplateOperation, 'accountId'>> &
  (
    | {
        accountId: Required<Template['categoryId']>;
        account: AccountExtended;
      }
    | {
        accountId?: undefined;
        account?: undefined;
      }
  );

export type TemplateExtended = Simplify<
  Except<Template, 'operations' | 'categoryId'> & {
    operations: TemplateOperationExtended[];
  }
> &
  (
    | {
        categoryId: Template['categoryId'];
        category: Category;
      }
    | {
        categoryId?: undefined;
        category?: undefined;
      }
  );
