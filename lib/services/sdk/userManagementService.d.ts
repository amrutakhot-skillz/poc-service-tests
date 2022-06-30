import { GetUserSegmentMembershipRequest } from '../portals/playerDetailsService';
import { AuthenticationService, Credentials } from './authenticationService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';
import { CurrencyCode, UserCurrencyService } from './userCurrencyService';
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
export declare class UserManagementService extends SkillzSDKAPI {
    protected authTokenService: AuthenticationService;
    protected userCurrencyService: UserCurrencyService;
    /**
     * Create a new UserManagementService instance, defines protected variables
     *
     * @param {Configuration} config Configuration
     * @param {AuthenticationService} authTokenService instance of authentication service, used to authenticate requests
     * @param {UserCurrencyService} userCurrencyService instance of user currency service, used to set or get user currency
     */
    constructor(config: Configuration, authTokenService: AuthenticationService, userCurrencyService: UserCurrencyService);
    /**
     * Create (async) a new user on the Skillz SDK and automatically defaults currency to USD.
     *
     * @param currencyISOCode (Optional) Automatically set currency to USD unless parameter is overridden. Pass null to skip setting the currency.
     */
    createNewUser(currencyISOCode?: CurrencyCode | null): Promise<User>;
    /**
     * Saves a birthdate for the given user - required before saving an account
     *
     * @param user User from created or logged in user
     * @param birthDate Birthdate in format YYYY-MM-DD, defaults to valid birthdate
     */
    saveBirthDate(user: User, birthDate?: string): Promise<PersonalInfo>;
    /**
     * Saves a given User's account in the SDK
     *
     * @param user User interface passed from created user
     * @param creds Credentials interface containing a username and password
     * @param options Optional, additional save account configuration
     */
    saveAccount(user: User, creds: Credentials, options?: SaveAccountOptions): Promise<User>;
    /**
     * Gets a given User's account info in the SDK
     *
     * @param creds Credentials interface containing a username and password
     */
    getUserInfo(creds: Credentials): Promise<User>;
    /**
     * Update player's username.
     *
     * @param user User to update.
     * @param creds User's credentials
     */
    updateUsername(user: User, creds: Credentials): Promise<User>;
    /**
     * Get (async) a user's segment membership, given their id and the target segment id
     *
     * @param request The request to get user membership for segment id
     * @throws An error if the user's segment membership cannot be retrieved
     */
    getUserSegmentMembership(request: GetUserSegmentMembershipRequest): Promise<number[]>;
}
