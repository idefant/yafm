import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';

import AuthController from '#controllers/AuthController';
import { checkAuth } from '#middlewares/checkAuthMiddleware';

const router = Router();

router.get('/isAuthorized', AuthController.checkIsAuthorized);

router.get('/profile', checkAuth, AuthController.getProfile);

router.post('/refresh', requiresAuth(), AuthController.refreshToken);

export default router;
