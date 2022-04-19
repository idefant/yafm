import { AES, enc, HmacSHA256, lib } from "crypto-js";

const getHmac = (data: lib.WordArray, pass: string) =>
  HmacSHA256(enc.Hex.stringify(data), pass).toString();

const checkHmac = (data: lib.WordArray, pass: string, hmac: string) =>
  getHmac(data, pass) === hmac;

export const aesEncrypt = (plaintext: string, passphrase: string) => {
  const iv = generateRandomBytes(128 / 8);
  const message = enc.Utf8.parse(plaintext);
  const cipher = AES.encrypt(message, passphrase, { iv }).toString();
  const hmac = getHmac(message, passphrase);
  return { cipher, iv: iv.toString(), hmac };
};

export const aesDecrypt = (
  cipher: string,
  passphrase: string,
  ivHex: string,
  hmac: string
) => {
  const iv = enc.Hex.parse(ivHex);
  const message = AES.decrypt(cipher, passphrase, { iv });
  return checkHmac(message, passphrase, hmac)
    ? enc.Utf8.stringify(message)
    : "";
};

export const generateRandomBytes = (bytesNumber: number) => {
  return lib.WordArray.random(bytesNumber);
};
