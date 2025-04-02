type Env = typeof window.env;

type EnvKey = keyof Env;

const envRequiredDict: Record<EnvKey, boolean> = {
  EXRATES_API_URL: true,
  OIDC_ACCOUNT_URL: false,
};

export const env = new Proxy(window.env, {
  get: (target, prop: string) => {
    if (!(prop in envRequiredDict)) return;

    if (envRequiredDict[prop as EnvKey]) {
      if (prop in target) {
        return target[prop as EnvKey];
      }
      const message = `Переменная ${prop} не задана. Установите ее значение в параметрах среды`;
      alert(message);
      throw new Error(message);
    }

    return target[prop as EnvKey];
  },
});
