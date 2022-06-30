import { Configuration } from '../sdk/skillzSDKAPI';
export interface Fingerprint {
    fingerprint: string;
    date_created: string;
}
export default class FingerprintService {
    protected configuration: Configuration;
    protected fingerprint: string;
    /**
     * Create the instance of the service.
     *
     * @param {Configuration} configuration The service's configuration.
     */
    constructor(configuration: Configuration);
    /**
     * Retrieve all valid fingerprints for the game specified in the configuration.
     * Uses an internal game-administration-service endpoint.
     *
     * @param config Override configuration option instead of using the wdio parsed configuration
     * @returns An array containing all Fingerprint objects for the game id configured
     */
    getFingerprints(config?: Configuration): Promise<Fingerprint[]>;
    /**
     * Retrieves a valid encrypted fingerprint token to be used in skillz-fingerprint-token header
     *
     * @param config Override configuration option instead of using the wdio parsed configuration
     * @returns a string representation of the encrypted token
     */
    getEncryptedToken(config?: Configuration): Promise<string>;
}
