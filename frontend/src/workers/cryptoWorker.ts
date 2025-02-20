/* eslint-disable no-restricted-globals */

import { AES, algo, enc, HmacSHA256, lib, PBKDF2 } from 'crypto-js';
import { EmptyObject } from 'type-fest';

import { EncryptedData } from '#types/cipherType';

type Data = { password: string; salt: string; encryptionKey: lib.WordArray } | EmptyObject;

let secret: Data = {};

const generateRandomBytes = (bytesNumber: number) => lib.WordArray.random(bytesNumber);

const generateSalt = () => generateRandomBytes(512 / 8);

const generateIV = () => generateRandomBytes(128 / 8);

const pass2key = (pass: string | lib.WordArray, salt: lib.WordArray) =>
  PBKDF2(pass, salt, {
    hasher: algo.SHA256,
    keySize: 256 / 32,
    iterations: 1000,
  });

const getHmac = (data: lib.WordArray, pass: lib.WordArray) =>
  HmacSHA256(enc.Hex.stringify(data), pass).toString();

const crypt = {
  setSecret(data: { password: string; salt?: string }) {
    if (data.salt) {
      const encryptionKey = pass2key(data.password, enc.Hex.parse(data.salt));
      secret = { password: data.password, salt: data.salt, encryptionKey };
    } else {
      const salt = generateSalt();
      const encryptionKey = pass2key(data.password, salt);
      secret = { password: data.password, salt: salt.toString(), encryptionKey };
    }
  },

  clearSecret() {
    secret = {};
  },

  encrypt(plaintext: string) {
    if (!('password' in secret)) {
      throw new Error('Для шифрования необходимо ввести пароль');
    }
    const message = enc.Utf8.parse(plaintext);
    const iv = generateIV();
    const cipher = AES.encrypt(message, secret.encryptionKey, { iv }).toString();
    const hmac = getHmac(message, secret.encryptionKey);
    return {
      cipher,
      iv: iv.toString(),
      hmac,
      salt: secret.salt,
    };
  },

  decrypt({ iv, hmac, cipher, salt }: EncryptedData, password?: string) {
    const encryptionKey = (() => {
      if (password) {
        return pass2key(password, enc.Hex.parse(salt));
      }
      if (!('password' in secret)) {
        throw new Error('Для расшифровки необходимо ввести пароль');
      }
      return secret.encryptionKey;
    })();
    const message = AES.decrypt(cipher, encryptionKey, { iv: enc.Hex.parse(iv) });
    return getHmac(message, encryptionKey) === hmac ? enc.Utf8.stringify(message) : undefined;
  },

  checkPassword(password: string) {
    if (!('password' in secret)) {
      throw new Error('Пароль не задан');
    }
    return secret.password === password;
  },
};

export type Crypt = typeof crypt;

type CryptAction = {
  [K in keyof Crypt]: { method: K; data: Parameters<Crypt[K]>; requestId: string };
}[keyof Crypt];

self.onmessage = (e: MessageEvent<CryptAction>) => {
  const res = (crypt[e.data.method] as any)(...e.data.data);
  self.postMessage({ data: res, requestId: e.data.requestId });
};
