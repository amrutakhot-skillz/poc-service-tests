import { AuthenticationService } from './authenticationService';
import SkillzSDKAPI, { Configuration } from './skillzSDKAPI';
import { User } from './userManagementService';
export interface LoginBonus {
    color: string;
    type: string;
    amount: number;
    seconds_to_login_bonus: number;
    login_bonus_cooldown: number;
}
export declare class LoginBonusService extends SkillzSDKAPI {
    protected authService: AuthenticationService;
    protected user: User;
    /**
     * Create an instance of the service.
     *
     * @param config The service's configuration.
     * @param authService An instance of AuthenticationService.
     * @param user A user as returned by UserManagementService.
     */
    constructor(config: Configuration, authService: AuthenticationService, user: User);
    /**
     * Claim a Login Bonus.
     *
     * @returns A Login Bonus API response
     * @throws An error if the Login Bonus could not be claimed
     */
    claimBonus(): Promise<LoginBonus>;
}
