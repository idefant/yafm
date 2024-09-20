export type TEncryptedData = {
  iv: string;
  hmac: string;
  cipher: string;
  salt: string;
};
