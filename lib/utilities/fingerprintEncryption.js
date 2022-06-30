"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
class FingerprintEncryption {
    /**
     * Generates a valid fingerprint token using the given parameters
     * A TypeScript implementation of the server toolbelt tool here: https://github.com/skillz/toolbelt/blob/master/scripts/fingerprint_token_encryptor_decryptor.py
     *
     * @param secretKey Secret key to use in encryption (different per environment)
     * @param iv initialization vector used to provide initial state
     * @param payload value to encode
     * @returns {string} encrypted token used in skillz-fingerprint-token
     */
    static encrypt(secretKey, iv, payload) {
        const toEncode = payload.binaryFingerprint + '.' + payload.epoch + '.' + payload.deviceId;
        const secretKeyBytes = crypto_js_1.default.enc.Hex.parse(secretKey);
        const bytesToEncrypt = crypto_js_1.default.enc.Utf8.parse(toEncode);
        const ciphertext = crypto_js_1.default.AES.encrypt(bytesToEncrypt, secretKeyBytes, {
            iv: iv,
            mode: crypto_js_1.default.mode.CBC,
            padding: crypto_js_1.default.pad.Pkcs7,
        }).ciphertext;
        const encrypted = iv.concat(ciphertext).toString(crypto_js_1.default.enc.Base64);
        return encrypted;
    }
    /**
     * Generates a random IV to use given the block size
     *
     * @param blockSize size of byte array to generate
     * @returns {cryptoJS.lib.WordArray} word/byte array for IV
     */
    static generateIV(blockSize) {
        return crypto_js_1.default.lib.WordArray.random(blockSize);
    }
}
exports.default = FingerprintEncryption;
FingerprintEncryption.BLOCK_SIZE = 16;
