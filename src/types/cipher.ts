export type EncryptedData = {
  iv: string;
  hmac: string;
  cipher: string;
  salt: string;
};
