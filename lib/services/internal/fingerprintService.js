"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const fingerprintEncryption_1 = __importDefault(require("../../utilities/fingerprintEncryption"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzSDKAPI_1 = __importDefault(require("../sdk/skillzSDKAPI"));
const logger = new logger_1.default(module);
class FingerprintService {
    /**
     * Create the instance of the service.
     *
     * @param {Configuration} configuration The service's configuration.
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.fingerprint = null;
    }
    /**
     * Retrieve all valid fingerprints for the game specified in the configuration.
     * Uses an internal game-administration-service endpoint.
     *
     * @param config Override configuration option instead of using the wdio parsed configuration
     * @returns An array containing all Fingerprint objects for the game id configured
     */
    getFingerprints(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config) {
                this.configuration = config;
            }
            logger.logStep(`Retrieving fingerprints for game ID: ${this.configuration.gameId} on ${this.configuration.environment}`);
            try {
                const response = yield axios_1.default.get(`http://game-administration-service.${this.configuration.environment}.skillz.com/v1/game-binary/fingerprint?game-id=${this.configuration.gameId}`);
                return response.data;
            }
            catch (e) {
                logger.logError(e);
                throw new Error('An error occurred while trying to fetch the Fingerprint array.');
            }
        });
    }
    /**
     * Retrieves a valid encrypted fingerprint token to be used in skillz-fingerprint-token header
     *
     * @param config Override configuration option instead of using the wdio parsed configuration
     * @returns a string representation of the encrypted token
     */
    getEncryptedToken(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fingerprint && !config) {
                // fingerprint doesn't change often and can be set only once per service instance. It can be further optimized to call only once per environment + game ID across all instances
                const fingerprintsResponse = yield this.getFingerprints(config);
                this.fingerprint = fingerprintsResponse[0].fingerprint;
            }
            const encryptionPayload = {
                binaryFingerprint: this.fingerprint,
                epoch: (0, moment_1.default)().unix(),
                deviceId: skillzSDKAPI_1.default.deviceIdHeader,
            };
            const iv = fingerprintEncryption_1.default.generateIV(fingerprintEncryption_1.default.BLOCK_SIZE);
            return fingerprintEncryption_1.default.encrypt(process.env[`FINGERPRINT_${this.configuration.environment.toUpperCase()}_KEY`], iv, encryptionPayload);
        });
    }
}
exports.default = FingerprintService;
