import { Configuration } from '../services/sdk/skillzSDKAPI';
export default class ServiceInterceptor {
    /**
     * Static flag to determined whether axios request interceptor has been setup. It must be setup only once for the lifetime of the test run.
     */
    protected static interceptorInitialized: boolean;
    /**
     * Configuration object with game ID and environment.
     */
    protected static currentConfiguration: Configuration;
    /**
     * Initializes the axios request interceptor.
     * Currently it adds the rotating fingerprint token but can be expanded for more common functionality.
     *
     * @param configuration Configuration object with game ID and environment
     */
    static setupFingerprintInterceptor(configuration: Configuration): void;
}
