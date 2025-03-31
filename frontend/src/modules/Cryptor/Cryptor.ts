import { EncryptedData } from '#types/cipherType';
import { transformedDataSchema, transformer } from '#utils/transformer';
import { spawnWorker } from '#utils/workerProxy';
import { CryptoWorker } from '#workers/cryptoWorker';

export const cryptoWorker = spawnWorker<CryptoWorker>(
  new Worker(new URL('../../workers/cryptoWorker.ts', import.meta.url), { type: 'module' }),
);

class Cryptor {
  /** Принимает любые сериализуемые данные и возвращает данные в зашифрованном формате */
  static async encrypt(data: any) {
    if (data === undefined) {
      throw new Error('Пустые данные: data = undefined');
    }

    const transformedData = await transformer(data).stringify().compress().runTransforms();
    const stringifiedData = JSON.stringify(transformedData);

    return cryptoWorker.encrypt(stringifiedData);
  }

  /**
   * Принимает данные в зашифрованном формате и возвращает статус и данные в случае успеха.
   *
   * Дешифрованные данные возвращаются в десериализованном формате, их тут же использовать.
   */
  static async decrypt(
    encryptedData: EncryptedData,
    password?: string,
  ): Promise<
    | { error: true; success?: undefined; data?: undefined }
    | { error?: undefined; success: true; data: any }
  > {
    const decryptedString = await cryptoWorker.decrypt(encryptedData, password);
    if (!decryptedString) return { error: true };

    const transformedData = JSON.parse(decryptedString);
    const transformedDataParsingResult = transformedDataSchema.safeParse(transformedData);
    if (transformedDataParsingResult.error) return { error: true };

    const sourceData = await transformer.getSourceData(transformedDataParsingResult.data);

    return { success: true, data: sourceData };
  }

  static checkPassword = cryptoWorker.checkPassword;

  static setSecret = cryptoWorker.setSecret;

  static clearSecret = cryptoWorker.clearSecret;
}

export default Cryptor;
