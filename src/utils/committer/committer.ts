import dayjs from 'dayjs';

import { store } from '#store';
import { TEncryptedData } from '#types/cipher';
import {
  CommitAction,
  CommitActionWithTransforms,
  CommitWithTransforms,
  Transform,
  updatedBaseMethods,
} from '#types/commitType';
import { aesEncrypt, aesDecrypt } from '#utils/crypto';
import Gzip from '#utils/gzip';

// XXX: Добавить метод push
// XXX: Заменять undefined на null
// XXX: Нужно делать проверку "было-стало" и очищать коммиты от ненужного

const runTransforms = async (action: CommitAction, transforms: Transform[]) => {
  const newActionData = await transforms.reduce(async (acc, transform) => {
    const transformDict = {
      gzip: () => Gzip.compress(JSON.stringify(acc)),
    };

    if (!(transform in transformDict)) {
      throw new Error('Unknown transform method');
    }
    return transformDict[transform]();
  }, action.data as any);

  return { ...action, data: newActionData, transforms };
};

const runBackTransforms = async (action: CommitActionWithTransforms) => {
  if (!action.transforms) return action;

  return action.transforms.toReversed().reduce((acc, transform) => {
    const transformDict = {
      gzip: async () => JSON.parse(await Gzip.decompress(acc)),
    };

    if (!(transform in transformDict)) {
      throw new Error('Unknown transform method');
    }
    return transformDict[transform]();
  }, action.data);
};

class Committer {
  actions: CommitAction[];

  date: Date;

  constructor(...actions: CommitAction[]) {
    this.actions = actions;
    this.date = new Date();
  }

  // XXX: Здесь же нужно делать dispatch всех новых обновлений
  add(...actions: CommitAction[]) {
    this.actions.push(...actions);
    this.date = new Date();
    return this;
  }

  setDate(date: Date | string) {
    this.date = dayjs(date).toDate();
    return this;
  }

  async encrypt() {
    if (this.actions.length === 0) {
      throw new Error('Список действий пуст');
    }
    const { password } = store.getState().app;
    if (!password) {
      throw new Error('Для шифрования нужен пароль');
    }

    return aesEncrypt(
      JSON.stringify({
        actions: await Promise.all(
          this.actions.map(async (action) =>
            updatedBaseMethods.some((method) => method === action.method)
              ? runTransforms(action, ['gzip'])
              : action,
          ),
        ),
        createdAt: this.date,
      }),
      password,
    );
  }

  static async decrypt(encryptedData: TEncryptedData, password = store.getState().app.password) {
    if (!password) throw new Error('Для расшифровки нужен пароль');

    const plaintext = aesDecrypt(encryptedData, password);
    if (!plaintext) return;

    const commitData: CommitWithTransforms = JSON.parse(plaintext);

    const transformedActions = await Promise.all(
      commitData.actions.map(async (action) =>
        action.transforms
          ? { method: action.method, data: await runBackTransforms(action) }
          : action,
      ),
    );

    return new Committer(...transformedActions).setDate(commitData.createdAt);
  }
}

export const committer = Object.assign(
  (...props: ConstructorParameters<typeof Committer>) => new Committer(...props),
  { decrypt: Committer.decrypt },
);

// XXX: Добавить метод идентификации бэкендом уже сохраненных коммитов без компрометации данных
//      (желательно детерминированный)
//      а также возможность сбросить старый идентификатор
