import 'express';
import { UserInfo } from '#types/oidcType';

interface Locals {
  user?: UserInfo;
}

declare module 'express' {
  export interface Response {
    locals: Locals;
  }
}
