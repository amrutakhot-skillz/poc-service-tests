import cryptoJS from 'crypto-js';
export interface EncryptionPayload {
    binaryFingerprint: string;
    epoch: number;
    deviceId: string;
}
export default class FingerprintEncryption {
    static BLOCK_SIZE: number;
    /**
     * Generates a valid fingerprint token using the given parameters
     * A TypeScript implementation of the server toolbelt tool here: https://github.com/skillz/toolbelt/blob/master/scripts/fingerprint_token_encryptor_decryptor.py
     *
     * @param secretKey Secret key to use in encryption (different per environment)
     * @param iv initialization vector used to provide initial state
     * @param payload value to encode
     * @returns {string} encrypted token used in skillz-fingerprint-token
     */
    static encrypt(secretKey: string, iv: cryptoJS.lib.WordArray, payload: EncryptionPayload): string;
    /**
     * Generates a random IV to use given the block size
     *
     * @param blockSize size of byte array to generate
     * @returns {cryptoJS.lib.WordArray} word/byte array for IV
     */
    static generateIV(blockSize: number): cryptoJS.lib.WordArray;
}
