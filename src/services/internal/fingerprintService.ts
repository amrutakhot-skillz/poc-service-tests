import axios from 'axios';
import moment from 'moment';
import FingerprintEncryption, {
  EncryptionPayload,
} from '../../utilities/fingerprintEncryption';
import Logger from '../../utilities/logger';
import SkillzSDKAPI, { Configuration } from '../sdk/skillzSDKAPI';

const logger = new Logger(module);

export interface Fingerprint {
  fingerprint: string;
  date_created: string;
}

export default class FingerprintService {
  protected fingerprint: string = null;

  /**
   * Create the instance of the service.
   *
   * @param {Configuration} configuration The service's configuration.
   */
  constructor(protected configuration: Configuration) {}

  /**
   * Retrieve all valid fingerprints for the game specified in the configuration.
   * Uses an internal game-administration-service endpoint.
   *
   * @param config Override configuration option instead of using the wdio parsed configuration
   * @returns An array containing all Fingerprint objects for the game id configured
   */
  async getFingerprints(config?: Configuration): Promise<Fingerprint[]> {
    if (config) {
      this.configuration = config;
    }
    logger.logStep(
      `Retrieving fingerprints for game ID: ${this.configuration.gameId} on ${this.configuration.environment}`
    );
    try {
      const response = await axios.get(
        `http://game-administration-service.${this.configuration.environment}.skillz.com/v1/game-binary/fingerprint?game-id=${this.configuration.gameId}`
      );
      return response.data;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        'An error occurred while trying to fetch the Fingerprint array.'
      );
    }
  }

  /**
   * Retrieves a valid encrypted fingerprint token to be used in skillz-fingerprint-token header
   *
   * @param config Override configuration option instead of using the wdio parsed configuration
   * @returns a string representation of the encrypted token
   */
  async getEncryptedToken(config?: Configuration): Promise<string> {
    if (!this.fingerprint && !config) {
      // fingerprint doesn't change often and can be set only once per service instance. It can be further optimized to call only once per environment + game ID across all instances
      const fingerprintsResponse = await this.getFingerprints(config);
      this.fingerprint = fingerprintsResponse[0].fingerprint;
    }
    const encryptionPayload: EncryptionPayload = {
      binaryFingerprint: this.fingerprint,
      epoch: moment().unix(),
      deviceId: SkillzSDKAPI.deviceIdHeader,
    };
    const iv = FingerprintEncryption.generateIV(
      FingerprintEncryption.BLOCK_SIZE
    );
    return FingerprintEncryption.encrypt(
      process.env[
        `FINGERPRINT_${this.configuration.environment.toUpperCase()}_KEY`
      ],
      iv,
      encryptionPayload
    );
  }
}
