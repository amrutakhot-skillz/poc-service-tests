import { AuthenticationService } from './authenticationService';
import { User } from './userManagementService';
export interface Configuration {
    gameId: number;
    environment: string;
}
interface KeyValueMap {
    [key: string]: {
        [key: string]: string | number;
    };
}
export default class SkillzSDKAPI {
    protected configuration: Configuration;
    /**
     * Device ID constant to be shared with the Fingerprint Service to generate fingerprint tokens
     */
    static readonly deviceIdHeader = "86127AB9-6998-4975-8B8A-B966E021D316";
    /**
     * Stores the baseURL used for the request
     * Uses gameID and environment to build the baseURL
     */
    protected baseURL: string;
    /**
     * Set the default headers for SDK requests
     *
     * TODO: Generate randomized device id
     */
    protected headerConfig: KeyValueMap;
    /**
     * Construct a new instance of the SDK API
     *
     * @param configuration contains a game id and environment to setup the base URL
     */
    constructor(configuration: Configuration);
    /**
     * Set the default device configuration for SDK requests
     */
    protected deviceInformation: {
        gps: boolean;
        id: string | number;
        location_services: boolean;
        mock_location: boolean;
        network_location: boolean;
        rooted: boolean;
        wifi: boolean;
    };
    /**
     * Set the default max amount of times to retry an API call
     */
    private maxRetries;
    /**
     * Track the current amount of times we have retried the current API call
     */
    private retryCount;
    /**
     * Set the interval of time in between API call retries
     * Format time in milliseconds (ms)
     */
    private retryInterval;
    /**
     * Retry an API call up to maxRetries amount of times, with retryInterval between each call
     *
     * @param fn Function to call when retrying
     * @param e Error passed in from original function, used to output original error even after retries
     * @returns Promise from original function
     * @throws Error if maximum amount of retries is reached
     */
    protected retry(fn: () => unknown, e: Error): Promise<unknown>;
    /**
     * Reset the retryCount for retrying API calls to 0
     */
    protected resetRetryCount(): void;
    /**
     * Waits a given amount of milliseconds before moving on
     *
     * @param ms Milliseconds to wait before moving on
     * @returns Promise that resolves when the sleep completes
     */
    sleep(ms: number): Promise<unknown>;
    /**
     * Sets the authorization header
     *
     * @param {User} user User object to set auth values against
     * @param {AuthenticationService} authService AuthenticationService class that creates the JWT token.
     */
    protected setAuthorizationHeader(user: User, authService: AuthenticationService): Promise<void>;
}
export {};
