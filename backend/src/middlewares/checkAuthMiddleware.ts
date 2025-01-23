import { requiresAuth } from 'express-openid-connect';

import { checkIsExpiredSession } from './checkIsExpiredSessionMiddleware';
import { checkUserGroup } from './checkUserGroupMiddleware';
import { getUserData } from './getUserDataMiddleware';

export const checkAuth = [requiresAuth(), checkUserGroup, checkIsExpiredSession, getUserData];
