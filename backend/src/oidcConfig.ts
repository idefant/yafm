import { ConfigParams } from 'express-openid-connect';

export const oidcConfig: ConfigParams = {
  authRequired: false,
  clientAuthMethod: 'client_secret_basic',
  issuerBaseURL: process.env.OIDC_ISSUER_BASE_URL,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  secret: process.env.OIDC_COOKIE_SECRET,
  baseURL: process.env.BASE_URL,
  errorOnRequiredAuth: true,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email roles',
  },
  session: {
    absoluteDuration: 10 * 365 * 24 * 60 * 60,
    rollingDuration: 365 * 24 * 60 * 60,
  },
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback',
    logout: '/api/auth/logout',
    postLogoutRedirect: '/login',
  },
  httpTimeout: 60_000,
  enableTelemetry: false,
};
