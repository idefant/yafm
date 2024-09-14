import { Get, IfNever, IsEmptyObject, Simplify } from 'type-fest';

// prettier-ignore
type NullishDeep<T> = {
  [K in keyof T]: T[K] extends object | undefined
    ? Simplify<NullishDeep<T[K]>>
    : undefined extends T[K]
      ? T[K] | null
      : T[K];
};

type Result<T, K extends number = 200> = Get<T, `responses.${K}.content.application/json`>;
type ResultCorrect<T, K extends number = 200> = IfNever<Result<T, K>, undefined, Result<T, K>>;

type Body<T> = Simplify<
  NullishDeep<
    Get<T, 'requestBody.content.application/json'> &
      Get<T, 'requestBody.content.application/x-www-form-urlencoded'>
  >
>;
type Params<T> = Get<T, 'parameters.path'>;
type Query<T> = Get<T, 'parameters.query'>;
type Props<T, Id extends keyof Params<T> | undefined = undefined> = Simplify<
  Body<T> & Query<T> & (Id extends string ? NormalizeId<Params<T>, Id> : Params<T>)
>;

type RTKOptions = {
  errorHandling?: boolean;
};

// prettier-ignore
type PropsWithOptions<T, Id extends keyof Params<T> | undefined = undefined> =
  IsEmptyObject<Props<T, Id>> extends true
    ? void | { rtk?: RTKOptions }
    : Simplify<Props<T, Id> & { rtk?: RTKOptions }>;

export type { ResultCorrect as ApiResult, PropsWithOptions as ApiProps };
