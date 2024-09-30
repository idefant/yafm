import { Asyncify, Promisable } from 'type-fest';

/* eslint-disable no-unused-vars */
const createActionsProxy = <
  T extends Record<string, (...props: any) => any>,
  K extends keyof T = keyof T,
>(
  callback: (method: K, data: Parameters<T[K]>) => Promisable<T[K]>,
): { [K in keyof T]: Asyncify<T[K]> } => {
  /* eslint-enable no-unused-vars */
  const proxy = new Proxy<any>(
    {},
    {
      get(_target, prop) {
        return (...data: any) => callback(prop as any, data);
      },
    },
  );
  return proxy;
};

// eslint-disable-next-line no-unused-vars
export const spawnWorker = <T extends Record<string, (...props: any) => any>>(worker: Worker) => {
  const proxy = createActionsProxy<T>((method, data) => {
    worker.postMessage({ method, data });

    return new Promise((resolve) => {
      worker.addEventListener('message', (e) => resolve(e.data), { once: true });
    });
  });
  return proxy;
};
