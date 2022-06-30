import axios from 'axios';
import Logger from '../../utilities/logger';
import { AuthenticationService } from './authenticationService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';
import { User } from './userManagementService';

const logger = new Logger(module);

export interface LoginBonus {
  color: string;
  type: string;
  amount: number;
  seconds_to_login_bonus: number;
  login_bonus_cooldown: number;
}

export class LoginBonusService extends SkillzSDKAPI {
  /**
   * Create an instance of the service.
   *
   * @param config The service's configuration.
   * @param authService An instance of AuthenticationService.
   * @param user A user as returned by UserManagementService.
   */
  constructor(
    config: Configuration,
    protected authService: AuthenticationService,
    protected user: User
  ) {
    super(config);
  }

  /**
   * Claim a Login Bonus.
   *
   * @returns A Login Bonus API response
   * @throws An error if the Login Bonus could not be claimed
   */
  async claimBonus(): Promise<LoginBonus> {
    logger.logInfo(`Using the API to claim a Login Bonus with an empty POST`);

    const authToken = await this.authService.fetchAuthToken({
      username: this.user.username,
      password: this.user.password,
    });
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;

    try {
      const response = await axios.post(
        this.baseURL + `/v1/login_bonus/claim`,
        {},
        {
          headers: this.headerConfig.headers,
        }
      );

      const loginBonus: LoginBonus = response.data;
      if (!loginBonus) {
        throw new Error(`The Login Bonus could not be claimed.`);
      }

      logger.logInfo(`${JSON.stringify(loginBonus)}`);
      return loginBonus;
    } catch (e) {
      if (e['response']) {
        logger.logInfo(`Status: ${e['response'].status}`);
        logger.logError(JSON.stringify(e['response'].data, null, 2));
        throw new Error('An error occurred while trying to claim Login Bonus');
      }

      throw e;
    }
  }
}
