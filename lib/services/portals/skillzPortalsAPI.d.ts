export interface PortalsConfiguration {
    portalScope: string;
    environment: string;
}
export default class SkillzPortalsAPI {
    protected configuration: PortalsConfiguration;
    /**
     * Stores the baseURL used for the request
     */
    protected baseURL: string;
    /**
     * Construct a new instance of the Portals API
     *
     * @param configuration Portal API settings
     */
    constructor(configuration: PortalsConfiguration);
    /**
     * Overrides the base URL to not use nginx.ts as a prefix
     *
     * @returns {string} Returns the base url
     */
    protected apiGatewayBaseURL(): string;
    /**
     * Overrides the base URL to not use nginx.ts as a prefix
     *
     * @returns {string} Returns the base url that is API Gateway 2 specific
     */
    protected apiGateway2BaseURL(): string;
    /**
     * Returns the base URL for the Admin Portal based on environment
     *
     * @returns {string} The base URL for the Admin Portal
     */
    protected adminPortalBaseURL(): string;
    /**
     * Generate a new moment 30 seconds in the future to use as the start time
     *
     * @returns Formatted string for time
     */
    protected getStartTimeNow(): string;
}
