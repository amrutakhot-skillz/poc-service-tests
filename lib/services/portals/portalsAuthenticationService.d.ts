import SkillzPortalsAPI from './skillzPortalsAPI';
export interface PortalsAuthToken {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
}
export interface APAuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    created_at: number;
    id_token: string;
}
export interface PortalsBasicAuth {
    username: string;
    password: string;
}
export declare class PortalsAuthenticationService extends SkillzPortalsAPI {
    /**
     * Returns the users secret key for the configured portal & environment
     *
     * @returns {string} Returns the client secret key for portals endpoints
     */
    protected getClientSecret(): string;
    /**
     * Returns the secret key for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The secret key for Admin Portal modules
     */
    protected getAPSecret(): string;
    /**
     * Returns the client id for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    protected getAPClientID(): string;
    /**
     * Returns the shared username for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    protected getAPUsername(): string;
    /**
     * Returns the shared password for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    protected getAPPassword(): string;
    /**
     * Fetch (async) an authentication token to be used by other API calls.
     *
     * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
     */
    fetchAuthToken(): Promise<PortalsAuthToken>;
    /**
     * Fetch (async) an authentication token to be used by API calls that are used in Admin Portal modules.
     *
     * @returns {APAuthToken} The JWT token for the Admin Portal
     */
    fetchAPAuthToken(): Promise<APAuthToken>;
    /**
     * Gets the Basic Auth Header
     *
     * @returns The username and password of the Portals Basic Auth
     */
    getAuthHeader(): PortalsBasicAuth;
}
