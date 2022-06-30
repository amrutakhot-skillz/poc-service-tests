import { AuthenticationService } from './authenticationService';
import { User } from './userManagementService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';
export interface UserCurrencyObject {
    base_currency: CurrencyCode;
}
export declare type CurrencyCode = 'USD' | 'INR';
export declare type CurrencySymbol = '$' | '₹';
export interface Currency {
    code: CurrencyCode;
    symbol: CurrencySymbol;
}
export declare class UserCurrencyService extends SkillzSDKAPI {
    protected authService: AuthenticationService;
    /**
     * Create the instance of the service.
     *
     * @param config The service's configuration.
     * @param authService instance of authentication service, used to authenticate requests
     */
    constructor(config: Configuration, authService: AuthenticationService);
    /**
     * Retrieve User Currency
     *
     * @param user Current logged in user.
     * @returns Instance of UserCurrencyObject with the currency ISO code
     */
    getUserCurrency(user: User): Promise<UserCurrencyObject>;
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
    setUserCurrency(user: User, currencyISOCode: CurrencyCode): Promise<boolean>;
}
