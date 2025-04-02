import { SetOptional } from 'type-fest';
import { z } from 'zod';

import { commitActionSchema } from '#schema/commitSchema';

export type SetOptionalWithout<T, K extends keyof T> = SetOptional<T, Exclude<keyof T, K>>;

export type CommitAction = z.infer<typeof commitActionSchema>;

export type CommitActionDict = { [T in CommitAction as T['method']]: T['data'] };

export const updatedBaseMethods = ['init_base', 'import_base', 'change_password'] as const;

export type Commit = {
  actions: CommitAction[];
  createdAt: number;
};
