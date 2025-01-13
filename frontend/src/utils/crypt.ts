import { Crypt } from '#workers/cryptoWorker';

import { spawnWorker } from './workerProxy';

export const crypt = spawnWorker<Crypt>(
  new Worker(new URL('../workers/cryptoWorker.ts', import.meta.url), { type: 'module' }),
);
