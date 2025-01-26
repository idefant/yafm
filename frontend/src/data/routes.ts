export const appRoutes = {
  // Unauth
  login: '/login',

  // Cabinet
  decrypt: '/decrypt',
  upload: '/upload',

  // Base
  dashboard: '/dashboard',
  accounts: '/accounts',
  accountDetails: '/accounts/:accountId',
  transactions: '/transactions',
  templates: '/templates',
  categories: '/categories',
  currencies: '/currencies',
  settings: '/settings',

  // Other
  forbidden: '/forbidden',
  notFound: '*',

  // OpenID Connect
  oidcLogin: '/api/auth/login',
  oidcLogout: '/api/auth/logout',
} as const;

export type AppRoutes = typeof appRoutes;
