import { AES, algo, enc, HmacSHA256, lib, PBKDF2 } from 'crypto-js';

import { TEncryptedData } from '#types/cipher';

const getHmac = (data: lib.WordArray, pass: lib.WordArray) =>
  HmacSHA256(enc.Hex.stringify(data), pass).toString();

export const pass2key = (pass: string | lib.WordArray, salt: lib.WordArray) =>
  PBKDF2(pass, salt, {
    hasher: algo.SHA256,
    keySize: 256 / 32,
    iterations: 1000,
  });

export const aesDecrypt = ({ iv, hmac, cipher }: TEncryptedData, key: lib.WordArray) => {
  const ivWA = enc.Hex.parse(iv);
  const message = AES.decrypt(cipher, key, { iv: ivWA });
  return getHmac(message, key) === hmac ? enc.Utf8.stringify(message) : undefined;
};

export const generateRandomBytes = (bytesNumber: number) => lib.WordArray.random(bytesNumber);

export const generateSalt = () => generateRandomBytes(512 / 8);

export const aesEncrypt = (plaintext: string, key: lib.WordArray) => {
  const message = enc.Utf8.parse(plaintext);
  const iv = generateRandomBytes(128 / 8);
  const cipher = AES.encrypt(message, key, { iv }).toString();
  const hmac = getHmac(message, key);
  return {
    cipher,
    iv: iv.toString(),
    hmac,
  };
};
