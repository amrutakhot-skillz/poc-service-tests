import axios from 'axios';
import Logger from '../../utilities/logger';
import { AuthenticationService } from './authenticationService';
import { User } from './userManagementService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';

const logger = new Logger(module);

export interface UserCurrencyObject {
  base_currency: CurrencyCode;
}

export type CurrencyCode = 'USD' | 'INR';

export type CurrencySymbol = '$' | '₹';

export interface Currency {
  code: CurrencyCode;
  symbol: CurrencySymbol;
}

export class UserCurrencyService extends SkillzSDKAPI {
  /**
   * Create the instance of the service.
   *
   * @param config The service's configuration.
   * @param authService instance of authentication service, used to authenticate requests
   */
  constructor(
    config: Configuration,
    protected authService: AuthenticationService
  ) {
    super(config);
  }

  /**
   * Retrieve User Currency
   *
   * @param user Current logged in user.
   * @returns Instance of UserCurrencyObject with the currency ISO code
   */
  async getUserCurrency(user: User): Promise<UserCurrencyObject> {
    await this.setAuthorizationHeader(user, this.authService);
    try {
      const response = await axios.get(this.baseURL + `/v1/user-currency`, {
        headers: this.headerConfig.headers,
      });
      return response.data;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        'An error occurred while trying to fetch the User Currency.'
      );
    }
  }

  /**
   * Update User Currency.
   * Meant to be called immediately after user creation when the following conditions are met:
   *  - If game property international_play_enabled is enabled for the game id. Currently enabled for game id 8626 and 81 on staging.
   *  - If OTA version is 27.2.10 and SDK version is greater than or equal to 27.2.0 (this value will change and tests that expect INR will need to be updated to reflect that).
   *
   * Can only be called once per account. If called twice, API will respond with HTTP Status Code 409 and this method will return False.
   *
   * @param user Current logged in user.
   * @param currencyISOCode ISO currency code.
   * @returns True if API call is successful, False if currency was already set.
   */
  async setUserCurrency(
    user: User,
    currencyISOCode: CurrencyCode
  ): Promise<boolean> {
    await this.setAuthorizationHeader(user, this.authService);
    try {
      const response = await axios.post(
        this.baseURL + `/v1/user-currency`,
        { base_currency: currencyISOCode },
        {
          headers: this.headerConfig.headers,
        }
      );
      return response.status === 201;
    } catch (error) {
      if (error.response.status === 409) {
        logger.logWarn(
          'Calling setCurrency on a user that already has their currency defined.'
        );
        return false;
      } else {
        logger.logError(error);
        throw new Error(
          'An error occurred while trying to update the User Currency.'
        );
      }
    }
  }
}
