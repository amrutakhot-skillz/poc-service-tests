import cryptoJS from 'crypto-js';

export interface EncryptionPayload {
  binaryFingerprint: string;
  epoch: number;
  deviceId: string;
}

export default class FingerprintEncryption {
  static BLOCK_SIZE = 16;

  /**
   * Generates a valid fingerprint token using the given parameters
   * A TypeScript implementation of the server toolbelt tool here: https://github.com/skillz/toolbelt/blob/master/scripts/fingerprint_token_encryptor_decryptor.py
   *
   * @param secretKey Secret key to use in encryption (different per environment)
   * @param iv initialization vector used to provide initial state
   * @param payload value to encode
   * @returns {string} encrypted token used in skillz-fingerprint-token
   */
  static encrypt(
    secretKey: string,
    iv: cryptoJS.lib.WordArray,
    payload: EncryptionPayload
  ): string {
    const toEncode =
      payload.binaryFingerprint + '.' + payload.epoch + '.' + payload.deviceId;
    const secretKeyBytes = cryptoJS.enc.Hex.parse(secretKey);
    const bytesToEncrypt = cryptoJS.enc.Utf8.parse(toEncode);
    const ciphertext = cryptoJS.AES.encrypt(bytesToEncrypt, secretKeyBytes, {
      iv: iv,
      mode: cryptoJS.mode.CBC,
      padding: cryptoJS.pad.Pkcs7,
    }).ciphertext;
    const encrypted = iv.concat(ciphertext).toString(cryptoJS.enc.Base64);
    return encrypted;
  }

  /**
   * Generates a random IV to use given the block size
   *
   * @param blockSize size of byte array to generate
   * @returns {cryptoJS.lib.WordArray} word/byte array for IV
   */
  static generateIV(blockSize: number): cryptoJS.lib.WordArray {
    return cryptoJS.lib.WordArray.random(blockSize);
  }
}
