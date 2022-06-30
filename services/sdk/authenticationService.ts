import axios from 'axios';
import Logger from '../../utilities/logger';
import SkillzSDKAPI from './skillzSDKAPI';

const logger = new Logger(module);

export interface AuthToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export class AuthenticationService extends SkillzSDKAPI {
  /**
   * Fetch (async) an authentication token to be used by other API calls.
   *
   * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
   *
   * @param credentials Credentials interface containing a username/password
   */
  async fetchAuthToken(credentials: Credentials): Promise<AuthToken> {
    const body = new URLSearchParams();

    // TODO: Move credentials into configuration.
    body.append('grant_type', 'password');
    body.append('username', credentials.username);
    body.append('password', credentials.password);
    body.append('scope', 'sdk');

    // TODO: Move URLs and game ids into configuration.
    try {
      const response = await axios.post(this.baseURL + '/oauth/token', body, {
        auth: {
          username: this.configuration.gameId.toString(),
          password: '',
        },
      });
      return response.data;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        'ERROR: An error occurred while trying to fetch an auth token.'
      );
    }
  }
}
