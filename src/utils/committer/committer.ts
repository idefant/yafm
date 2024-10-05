import dayjs from 'dayjs';
import Swal from 'sweetalert2';

import { mainApi } from '#api/mainApi';
import { store } from '#store';
import { EncryptedData } from '#types/cipher';
import {
  CommitAction,
  CommitActionWithTransforms,
  CommitWithTransforms,
  Transform,
  updatedBaseMethods,
} from '#types/commitType';
import { crypt } from '#utils/crypt';
import Gzip from '#utils/gzip';

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

  private async encrypt() {
    if (this.actions.length === 0) {
      throw new Error('Список действий пуст');
    }
    const commitData = {
      actions: await Promise.all(
        this.actions.map(async (action) =>
          updatedBaseMethods.some((method) => method === action.method)
            ? runTransforms(action, ['gzip'])
            : action,
        ),
      ),
      createdAt: this.date,
    };

    return crypt.encrypt(JSON.stringify(commitData));
  }

  static async decrypt(encryptedData: EncryptedData) {
    const plaintext = await crypt.decrypt(encryptedData);
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

  async sync() {
    const { dispatch } = store;
    const encryptedData = await this.encrypt();
    const res = await dispatch(mainApi.endpoints.createCommit.initiate(encryptedData));
    if ('error' in res) {
      Swal.fire({
        title: 'Ошибка сохранения данных',
        icon: 'error',
      });
    }
    return res;
  }
}

export const committer = Object.assign(
  (...props: ConstructorParameters<typeof Committer>) => new Committer(...props),
  { decrypt: Committer.decrypt },
);

// XXX: Добавить метод идентификации бэкендом уже сохраненных коммитов без компрометации данных
//      (желательно детерминированный)
//      а также возможность сбросить старый идентификатор
