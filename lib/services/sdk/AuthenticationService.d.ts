import SkillzSDKAPI from './skillzSDKAPI';
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
export declare class AuthenticationService extends SkillzSDKAPI {
    /**
     * Fetch (async) an authentication token to be used by other API calls.
     *
     * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
     *
     * @param credentials Credentials interface containing a username/password
     */
    fetchAuthToken(credentials: Credentials): Promise<AuthToken>;
}
