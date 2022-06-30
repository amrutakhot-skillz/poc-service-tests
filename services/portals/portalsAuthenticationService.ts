import axios from 'axios';
import Logger from '../../utilities/logger';
import SkillzPortalsAPI from './skillzPortalsAPI';

const logger = new Logger(module);

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
export class PortalsAuthenticationService extends SkillzPortalsAPI {
  /**
   * Returns the users secret key for the configured portal & environment
   *
   * @returns {string} Returns the client secret key for portals endpoints
   */
  protected getClientSecret(): string {
    const secretKey =
      process.env[
        `${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_KEY`
      ];
    if (!secretKey) {
      throw new Error(
        'An error occurred while trying to fetch the users secret key.'
      );
    }
    return secretKey;
  }

  /**
   * Returns the secret key for Admin Portal modules.
   * This is needed for obtaining a JWT token from the Admin Portal.
   *
   * @returns {string} The secret key for Admin Portal modules
   */
  protected getAPSecret(): string {
    const secretKey =
      process.env[
        `${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_SECRET`
      ];
    if (!secretKey) {
      throw new Error(
        'An error occurred while trying to fetch the admin portal modules secret key.'
      );
    }
    return secretKey;
  }

  /**
   * Returns the client id for Admin Portal modules.
   * This is needed for obtaining a JWT token from the Admin Portal.
   *
   * @returns {string} The UID for Admin Portal modules
   */
  protected getAPClientID(): string {
    const clientID =
      process.env[
        `${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_CLIENT_ID`
      ];
    if (!clientID) {
      throw new Error(
        'An error occurred while trying to fetch the admin portal modules client id.'
      );
    }
    return clientID;
  }

  /**
   * Returns the shared username for Admin Portal modules.
   * This is needed for obtaining a JWT token from the Admin Portal.
   *
   * @returns {string} The UID for Admin Portal modules
   */
  protected getAPUsername(): string {
    const username =
      process.env[
        `${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_USERNAME`
      ];
    if (!username) {
      throw new Error(
        'An error occurred while trying to fetch the admin portal modules username.'
      );
    }
    return username;
  }

  /**
   * Returns the shared password for Admin Portal modules.
   * This is needed for obtaining a JWT token from the Admin Portal.
   *
   * @returns {string} The UID for Admin Portal modules
   */
  protected getAPPassword(): string {
    const password =
      process.env[
        `${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_PASSWORD`
      ];
    if (!password) {
      throw new Error(
        'An error occurred while trying to fetch the admin portal modules password.'
      );
    }
    return password;
  }

  /**
   * Fetch (async) an authentication token to be used by other API calls.
   *
   * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
   */
  async fetchAuthToken(): Promise<PortalsAuthToken> {
    const body = new URLSearchParams();

    body.append('client_id', this.configuration.portalScope);
    body.append('grant_type', 'client_credentials');
    body.append('client_secret', this.getClientSecret());
    body.append('scope', this.configuration.portalScope);

    try {
      const response = await axios.post(
        this.apiGatewayBaseURL() + '/oauth/token',
        body,
        {
          auth: {
            username: this.configuration.portalScope,
            password: this.getClientSecret(),
          },
        }
      );
      return response.data;
    } catch (e) {
      logger.logStep(e);
      throw new Error('An error occurred while trying to fetch an auth token.');
    }
  }

  /**
   * Fetch (async) an authentication token to be used by API calls that are used in Admin Portal modules.
   *
   * @returns {APAuthToken} The JWT token for the Admin Portal
   */
  async fetchAPAuthToken(): Promise<APAuthToken> {
    try {
      const response = await axios.post(
        this.adminPortalBaseURL() + '/oauth/token',
        {
          grant_type: 'password',
          client_id: this.getAPClientID(),
          client_secret: this.getAPSecret(),
          username: this.getAPUsername(),
          password: this.getAPPassword(),
        }
      );
      return response.data;
    } catch (e) {
      logger.logStep(e);
      throw new Error('An error occurred while trying to fetch an auth token.');
    }
  }

  /**
   * Gets the Basic Auth Header
   *
   * @returns The username and password of the Portals Basic Auth
   */
  getAuthHeader(): PortalsBasicAuth {
    return {
      username: this.configuration.portalScope,
      password: this.getClientSecret(),
    };
  }
}
