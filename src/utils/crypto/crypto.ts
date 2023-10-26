import { AES, algo, enc, HmacSHA256, lib, PBKDF2 } from 'crypto-js';

const getHmac = (data: lib.WordArray, pass: lib.WordArray) =>
  HmacSHA256(enc.Hex.stringify(data), pass).toString();

export const pass2key = (pass: string | lib.WordArray, salt: lib.WordArray) =>
  PBKDF2(pass, salt, {
    hasher: algo.SHA256,
    keySize: 256 / 32,
    iterations: 1000,
  });

export const aesDecrypt = (
  cipher: string,
  pass: string,
  ivHex: string,
  hmac: string,
  salt: string,
) => {
  const key = pass2key(pass, enc.Hex.parse(salt));
  const iv = enc.Hex.parse(ivHex);
  const message = AES.decrypt(cipher, key, { iv });
  return getHmac(message, key) === hmac ? enc.Utf8.stringify(message) : '';
};

export const generateRandomBytes = (bytesNumber: number) => lib.WordArray.random(bytesNumber);

export const aesEncrypt = (plaintext: string, pass: string) => {
  const message = enc.Utf8.parse(plaintext);
  const iv = generateRandomBytes(128 / 8);
  const salt = generateRandomBytes(256);
  const key = pass2key(pass, salt);
  const cipher = AES.encrypt(message, key, { iv }).toString();
  const hmac = getHmac(message, key);
  return {
    cipher,
    iv: iv.toString(),
    hmac,
    salt: salt.toString(),
  };
};
