import { AxiosResponse } from 'axios';

export type TRequest<T = any, D = any> = Promise<AxiosResponse<T, D>>;
