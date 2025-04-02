/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: {
      EXRATES_API_URL: string;
      OIDC_ACCOUNT_URL?: string;
    };
  }
}

export {};
