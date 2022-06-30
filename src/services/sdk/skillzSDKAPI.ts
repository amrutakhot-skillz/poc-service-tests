import Logger from '../../utilities/logger';
import ServiceInterceptor from '../../utilities/serviceInterceptor';
import { AuthenticationService } from './authenticationService';
import { User } from './userManagementService';

const logger = new Logger(module);
export interface Configuration {
  gameId: number;
  environment: string;
}
interface KeyValueMap {
  [key: string]: { [key: string]: string | number };
}
export default class SkillzSDKAPI {
  /**
   * Device ID constant to be shared with the Fingerprint Service to generate fingerprint tokens
   */
  static readonly deviceIdHeader = '86127AB9-6998-4975-8B8A-B966E021D316';

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
  protected headerConfig: KeyValueMap = {
    headers: {
      'X-Skillz-Sdk-Version': '28.0.543', // picking a version unlikely to be a real SDK version to differentiate in Server logs
      'X-Skillz-OS-Version': '14.1',
      'X-Skillz-Ota-Version': '28.0.100', // Silver INR-aware version
      'X-Skillz-Game': this.configuration.gameId,
      'X-Skillz-Retry-After-Millis': 2000,
      'X-Skillz-iOS-IFA': 'DC4D1635-82AD-4570-B533-E14B97A84172',
      'X-Skillz-iOS-Bundle-Id':
        'com.skillz.enterprise.test.radium.nightly.debug',
      'X-Skillz-Request-Queue-Date': new Date().toISOString(),
      'X-Skillz-Platform': 'iOS',
      'X-Skillz-Device': 'iPhone13,4 (iPhone13,4)',
      'X-Skillz-iOS-IFV': 'D6651185-C3F3-45A9-BF55-81104E47AEED',
      'Skillz-secure': 'true',
      'X-Skillz-Transaction-Id': 'd1404076-bed0-41a3-94b4-fc5a8d963f65',
      'X-Skillz-App-Fingerprint':
        '$ios$app$100000c0000$16aa$170008130000|eca77977c35d58f87e1b798a55004bfb4587ea371af3690bc5e5fd21',
      'X-Skillz-Fingerprint': 'Fingerprint',
      'X-Skillz-Device-Id': SkillzSDKAPI.deviceIdHeader,
      'X-Skillz-Location': '45.533125,-122.684161,' + new Date().toISOString(), // TODO: Generate dynamic location data.
      'Skillz-Timezone-Offset': '-07:00',
      'X-Skillz-iOS-Ad-Tracking-Disabled': '0',
      'Accept-Language': 'en;q=1',
      'X-Skillz-State': '0',
    },
  };

  /**
   * Construct a new instance of the SDK API
   *
   * @param configuration contains a game id and environment to setup the base URL
   */
  constructor(protected configuration: Configuration) {
    this.baseURL = `https://${this.configuration.gameId}.ts.${this.configuration.environment}.skillz.com`;
    // TODO: make this setup part of Appium and Mocha startup https://skillzinc.atlassian.net/browse/PS-49139
    ServiceInterceptor.setupFingerprintInterceptor(configuration);
  }

  /**
   * Set the default device configuration for SDK requests
   */
  protected deviceInformation = {
    gps: true,
    id: this.headerConfig.headers['X-Skillz-Device-Id'],
    location_services: true,
    mock_location: false,
    network_location: true,
    rooted: false,
    wifi: true,
  };

  /**
   * Set the default max amount of times to retry an API call
   */
  private maxRetries = 2;

  /**
   * Track the current amount of times we have retried the current API call
   */
  private retryCount = 0;

  /**
   * Set the interval of time in between API call retries
   * Format time in milliseconds (ms)
   */
  private retryInterval = 2000;

  /**
   * Retry an API call up to maxRetries amount of times, with retryInterval between each call
   *
   * @param fn Function to call when retrying
   * @param e Error passed in from original function, used to output original error even after retries
   * @returns Promise from original function
   * @throws Error if maximum amount of retries is reached
   */
  protected async retry(fn: () => unknown, e: Error): Promise<unknown> {
    logger.logWarn(`Retrying last api call from function: ${fn.name}`);
    if (this.retryCount >= this.maxRetries) {
      this.resetRetryCount();
      throw e;
    }
    this.retryCount += 1;
    await this.sleep(this.retryInterval);
    return fn();
  }

  /**
   * Reset the retryCount for retrying API calls to 0
   */
  protected resetRetryCount(): void {
    this.retryCount = 0;
  }

  /**
   * Waits a given amount of milliseconds before moving on
   *
   * @param ms Milliseconds to wait before moving on
   * @returns Promise that resolves when the sleep completes
   */
  public sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Sets the authorization header
   *
   * @param {User} user User object to set auth values against
   * @param {AuthenticationService} authService AuthenticationService class that creates the JWT token.
   */
  protected async setAuthorizationHeader(
    user: User,
    authService: AuthenticationService
  ): Promise<void> {
    const authToken = await authService.fetchAuthToken({
      username: user.username,
      password: user.password,
    });
    this.headerConfig.headers[
      'Authorization'
    ] = `Bearer ${authToken.access_token}`;
  }
}
