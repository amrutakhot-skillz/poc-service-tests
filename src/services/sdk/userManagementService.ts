import axios from 'axios';
import Logger from '../../utilities/logger';
import { GetUserSegmentMembershipRequest } from '../portals/playerDetailsService';
import { AuthenticationService, Credentials } from './authenticationService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';
import { CurrencyCode, UserCurrencyService } from './userCurrencyService';

const logger = new Logger(module);

// TODO: Update leaderboard and ticketz to not look for "object" type https://skillzinc.atlassian.net/browse/PS-33298
export interface User {
  id: string;
  username: string;
  password: string;
  can_update_username: boolean;
  cash_balance: number;
  bonus_balance: number;
  z_balance: number;
  email: string;
  email_verified: boolean;
  avatar_url: string;
  thumbnail_url: string;
  flag_url: string;
  email_opt_in: boolean;
  leaderboards: Leaderboards;
  ticketz: UserTicketz;
  show_support_messages: boolean;
  unread_support_message_count: boolean;
  registration_required: boolean;
  email_verification_required: boolean;
  chat_moderator: boolean;
  skillz_staff: boolean;
  chat_registration_required: boolean;
}

export interface Leaderboards {
  cash_rank: number;
  cash_winnings: number;
  z_rank: number;
  z_winnings: number;
}

export interface UserTicketz {
  balance: number;
  multiplier: number;
  next_multiplier: number;
  progress: number;
  goal: number;
  expires_at: string;
  scalable_image: string;
}

export interface PersonalInfo {
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  secondary_emails: SecondaryEmail[];
  billing_address: Address;
  shipping_address: Address;
}

export interface SecondaryEmail {
  email?: string;
  verified?: boolean;
}

export interface Address {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip?: string;
}

export interface SaveAccountOptions {
  emailAddress?: string;
  emailOptIn?: boolean;
}

type userCountry = 'US' | 'Canada';

const userGpsLocation = {
  US: '45.533125,-122.684161,',
  CANADA: '49.2827,-123.1207,',
};

export class UserManagementService extends SkillzSDKAPI {
  /**
   * Create a new UserManagementService instance, defines protected variables
   *
   * @param {Configuration} config Configuration
   * @param {AuthenticationService} authTokenService instance of authentication service, used to authenticate requests
   * @param {UserCurrencyService} userCurrencyService instance of user currency service, used to set or get user currency
   */
  constructor(
    config: Configuration,
    protected authTokenService: AuthenticationService,
    protected userCurrencyService: UserCurrencyService
  ) {
    super(config);
  }

  /**
   * Create (async) a new user on the Skillz SDK and automatically defaults currency to USD.
   *
   * @param currencyISOCode (Optional) Automatically set currency to USD unless parameter is overridden. Pass null to skip setting the currency.
   * @param country (Optional) Sets user gps location to US unless parameter is overridden.
   */
  async createNewUser(
    currencyISOCode: CurrencyCode | null = 'USD',
    country: userCountry | null = 'US'
  ): Promise<User> {
    // TODO: Move this to logStep common package https://skillzinc.atlassian.net/browse/PS-33127
    logger.logStep('Creating a new user.');

    if (country == 'Canada') {
      this.headerConfig.headers['X-Skillz-Location'] =
        userGpsLocation.CANADA + new Date().toISOString();
    }

    try {
      const response = await axios.post(
        this.baseURL + '/v1/users',
        {
          password: 'password',
        },
        {
          headers: this.headerConfig.headers,
          auth: {
            username: this.configuration.gameId.toString(),
            password: '',
          },
        }
      );
      logger.logInfo(`Created user: ${response.data.username}`);
      logger.logInfo(`User ID: ${response.data.id}`);
      response.data.password = 'password';
      if (currencyISOCode) {
        this.userCurrencyService.setUserCurrency(
          response.data,
          currencyISOCode
        );
      }

      if (country) {
        this.setLocation(response.data);
      }

      return response.data;
    } catch (e) {
      logger.logInfo(`Status: ${e?.response?.status}`);
      logger.logInfo(e?.response?.data);
      throw new Error(
        'ERROR: An error occurred while trying to fetch a new user.'
      );
    }
  }

  /**
   * Saves a birthdate for the given user - required before saving an account
   *
   * @param user User from created or logged in user
   * @param birthDate Birthdate in format YYYY-MM-DD, defaults to valid birthdate
   */
  async saveBirthDate(
    user: User,
    birthDate = '1992-12-17'
  ): Promise<PersonalInfo> {
    const creds: Credentials = {
      username: user.username,
      password: user.password,
    };
    const authToken = await this.authTokenService.fetchAuthToken(creds);
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;
    try {
      const response = await axios.patch(
        this.baseURL + `/v1/users/${user.id}/personal`,
        {
          birth_date: birthDate,
        },
        {
          headers: this.headerConfig.headers,
        }
      );
      logger.logInfo(`Updated birth_date: ${response.data.birth_date}`);
      return response.data;
    } catch (e) {
      logger.logInfo(`Status: ${e['response'].status}`);
      logger.logInfo(e['response'].data);
      throw new Error(
        'ERROR: An error occurred while trying to update user birthdate.'
      );
    }
  }

  /**
   * Saves a given User's account in the SDK
   *
   * @param user User interface passed from created user
   * @param creds Credentials interface containing a username and password
   * @param options Optional, additional save account configuration
   */
  async saveAccount(
    user: User,
    creds: Credentials,
    options?: SaveAccountOptions
  ): Promise<User> {
    const authToken = await this.authTokenService.fetchAuthToken(creds);
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;
    logger.logStep(`Saving account information for user: ${creds.username}.`);
    try {
      const response = await axios.patch(
        this.baseURL + `/v1/users/${user.id}`,
        {
          email: options?.emailAddress
            ? options.emailAddress
            : `automation+${creds.username}@skillz.com`,
          password: creds.password,
          old_password: creds.password,
          email_opt_in: options?.emailOptIn ? options.emailOptIn : false,
        },
        {
          headers: this.headerConfig.headers,
        }
      );
      return response.data;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        'ERROR: An error occurred while trying to save the user account.'
      );
    }
  }

  /**
   * Gets a given User's account info in the SDK
   *
   * @param creds Credentials interface containing a username and password
   */
  async getUserInfo(creds: Credentials): Promise<User> {
    const authToken = await this.authTokenService.fetchAuthToken(creds);
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;
    logger.logStep(
      `Receiving account information for user: ${creds.username}.`
    );
    try {
      const response = await axios.get(this.baseURL + `/v1/user`, {
        headers: this.headerConfig.headers,
      });

      const user: User = response.data;
      user.password = creds.password;

      return user;
    } catch (e) {
      logger.logInfo(`Status: ${e['response'].status}`);
      logger.logInfo(e['response'].data);
      throw new Error(
        'ERROR: An error occurred while trying to get the user account information.'
      );
    }
  }

  /**
   * Update player's username.
   *
   * @param user User to update.
   * @param creds User's credentials
   */
  async updateUsername(user: User, creds: Credentials): Promise<User> {
    const authToken = await this.authTokenService.fetchAuthToken(creds);
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;
    logger.logStep(
      `Updating username for: ${creds.username} to ${user.username}.`
    );
    try {
      const response = await axios.patch(
        this.baseURL + `/v1/users/${user.id}`,
        {
          username: user.username,
        },
        {
          headers: this.headerConfig.headers,
        }
      );
      return response.data;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        'ERROR: An error occurred while trying to update the user username.'
      );
    }
  }

  /**
   * Get (async) a user's segment membership, given their id and the target segment id
   *
   * @param request The request to get user membership for segment id
   * @throws An error if the user's segment membership cannot be retrieved
   */
  async getUserSegmentMembership(
    request: GetUserSegmentMembershipRequest
  ): Promise<number[]> {
    logger.logStep("Getting the user's segment membership.");

    const user_ids: number[] = [parseInt(request.user.id)];
    const segment_ids: number[] = [request.segmentId];
    const realRequest = {
      user_ids: user_ids,
      segment_ids: segment_ids,
    };
    const creds: Credentials = {
      username: request.user.username,
      password: request.user.password,
    };
    const authToken = await this.authTokenService.fetchAuthToken(creds);

    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;

    try {
      const response = await axios.post(
        `${this.baseURL}/v1/segment_membership?=`,
        realRequest,
        {
          headers: this.headerConfig.headers,
        }
      );
      return response.data.user_ids;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        "An error occurred while trying to get the user's segment membership."
      );
    }
  }

  /**
   * Update player's last known location.
   *
   * @param user User to update.
   */
  async setLocation(user: User): Promise<boolean> {
    logger.logInfo(`Using the API to claim a Login Bonus with an empty POST`);

    const authToken = await this.authTokenService.fetchAuthToken({
      username: user.username,
      password: user.password,
    });

    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;

    try {
      const response = await axios.post(
        'http://location-service.internal.staging.cloud.skillz.com/user-location',
        {
          user_id: user.id,
        },
        {
          headers: this.headerConfig.headers,
        }
      );
      return response.status === 200;
    } catch (e) {
      throw new Error(
        e + 'An error occurred while trying to set user location'
      );
    }
  }
}
