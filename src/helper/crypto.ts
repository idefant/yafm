import { AES, enc, lib } from "crypto-js";

export const aesEncrypt = (plaintext: string, passphrase: string) => {
  const iv = generateRandomBytes(128 / 8);
  const cipher = AES.encrypt(plaintext, passphrase, { iv }).toString();
  return { cipher, iv: iv.toString() };
};

export const aesDecrypt = (
  cipher: string,
  passphrase: string,
  ivHex: string
) => {
  const iv = enc.Hex.parse(ivHex);
  const plaintext = enc.Utf8.stringify(AES.decrypt(cipher, passphrase, { iv }));
  return plaintext;
};

export const generateRandomBytes = (bytesNumber: number) => {
  return lib.WordArray.random(bytesNumber);
};
