import { exhaustiveCheck } from '#utils/exhaustiveCheck';
import Gzip from '#utils/gzip';

import { Transform, TransformedData } from './transformerType';

/**
 * Утилита для конвертации любых данных к стандартному виду и обратно.
 */
class Transformer {
  private data: any;

  private transforms: Transform[] = [];

  constructor(data: any) {
    this.data = data;
  }

  stringify() {
    this.transforms.push('json');
    return this;
  }

  compress() {
    this.transforms.push('gzip');
    return this;
  }

  async runTransforms(): Promise<TransformedData> {
    let { data } = this;
    const transforms: Transform[] = [];

    for await (const transform of this.transforms) {
      if (transform === 'json') {
        if (typeof data === 'string') break;
        transforms.push('json');
        data = JSON.stringify(data);
        break;
      }
      if (transform === 'gzip') {
        const compressedData = await Gzip.compress(data);
        if (compressedData.length >= data.length) break;
        transforms.push('gzip');
        this.data = compressedData;
        break;
      }
      exhaustiveCheck(transform);
    }
    return { data, transforms };
  }

  static async getSourceData(transformedData: TransformedData) {
    let { data } = transformedData;

    for await (const transform of transformedData.transforms) {
      if (transform === 'gzip') {
        data = await Gzip.decompress(data);
        break;
      }
      if (transform === 'json') {
        data = JSON.parse(data);
        break;
      }
      exhaustiveCheck(transform);
    }
    return data;
  }
}

export const transformer = Object.assign(
  (...params: ConstructorParameters<typeof Transformer>) => new Transformer(...params),
  {
    getSourceData: Transformer.getSourceData,
  },
);
