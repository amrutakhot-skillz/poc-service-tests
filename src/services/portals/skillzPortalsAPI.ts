import moment from 'moment';
export interface PortalsConfiguration {
  portalScope: string;
  environment: string;
}

export default class SkillzPortalsAPI {
  /**
   * Stores the baseURL used for the request
   */
  protected baseURL: string;

  /**
   * Construct a new instance of the Portals API
   *
   * @param configuration Portal API settings
   */
  constructor(protected configuration: PortalsConfiguration) {
    this.baseURL = `https://nginx.ts.${this.configuration.environment}.skillz.com`;
  }

  /**
   * Overrides the base URL to not use nginx.ts as a prefix
   *
   * @returns {string} Returns the base url
   */
  protected apiGatewayBaseURL(): string {
    if (this.configuration.environment.toLowerCase() == 'staging') {
      return `https://${this.configuration.environment}.skillz.com`;
    } else {
      return this.baseURL;
    }
  }

  /**
   * Overrides the base URL to not use nginx.ts as a prefix
   *
   * @returns {string} Returns the base url that is API Gateway 2 specific
   */
  protected apiGateway2BaseURL(): string {
    if (this.configuration.environment.toLowerCase() == 'staging') {
      return `https://gateway.us-east-1.${this.configuration.environment}.cloud.skillz.com`;
    } else if (this.configuration.environment.toLowerCase() == 'qa') {
      return `https://gateway.us-east-1.dev.cloud.skillz.com`;
    } else {
      return this.baseURL;
    }
  }

  /**
   * Returns the base URL for the Admin Portal based on environment
   *
   * @returns {string} The base URL for the Admin Portal
   */
  protected adminPortalBaseURL(): string {
    return `https://admin.${this.configuration.environment.toLowerCase()}.skillz.com`;
  }

  /**
   * Generate a new moment 30 seconds in the future to use as the start time
   *
   * @returns Formatted string for time
   */
  protected getStartTimeNow(): string {
    return moment().add(30, 'seconds').utc().format();
  }
}
