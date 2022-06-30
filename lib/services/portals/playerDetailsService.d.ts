import { User, UserManagementService } from '../sdk/userManagementService';
import { PortalsAuthenticationService } from './portalsAuthenticationService';
import SkillzPortalsAPI, { PortalsConfiguration } from './skillzPortalsAPI';
export interface UpdateBalanceUserInfoResponse {
    userId: string;
    username: string;
    balance: number;
    lockedBalance: number;
    pointsBalance: number;
}
export interface BalanceRequest {
    user_id: number;
    game_id?: number;
    tournament_id?: number;
    balance_deposit: number;
    cash_bonus: number;
    points_bonus: number;
    entry_id?: number;
}
export interface UpdateTicketzBalanceRequest {
    userId: number;
    ticketz: number;
}
export interface GetTicketzBalanceRequest {
    user: User;
    userService: UserManagementService;
}
export interface GetTicketzBalanceResponse {
    balance: number;
    multiplier: number;
    next_multiplier: number;
    progress: number;
}
export interface UpdateTicketzUserInfoResponse {
    userId: number;
}
export interface GetUserSegmentMembershipRequest {
    user: User;
    segmentId: number;
}
export declare class PlayerDetailsService extends SkillzPortalsAPI {
    protected authService: PortalsAuthenticationService;
    /**
     * Create a new instance of the service.
     *
     * @param config The service's configuration details.
     * @param authService An instance of the authentication service.
     */
    constructor(config: PortalsConfiguration, authService: PortalsAuthenticationService);
    /**
     * Update (async) a user's balance. This includes cash, bonus cash, and
     * bonus points.
     *
     * @param request The balance data to update.
     * @returns The updated user's info.
     * @throws An error if the user's balance cannot be updated.
     */
    updateBalance(request: BalanceRequest): Promise<UpdateBalanceUserInfoResponse>;
    /**
     * Set (async) a user's balance. This includes cash, bonus cash, and
     * bonus points.
     *
     * @param user The user to set balance
     * @param request The balance data to set.
     * @returns The updated user's info.
     * @throws An error if the user's balance cannot be set.
     */
    setBalance(user: User, request: BalanceRequest): Promise<UpdateBalanceUserInfoResponse>;
    /**
     * Sanitary function of updateBalance. Adding user's cash balance
     *
     * @param userId The id of user.
     * @param amount The cash amount to be added.
     * @returns The updated user's info.
     * @throws An error if the user's balance cannot be updated.
     */
    addCashBalance(userId: number, amount: number): Promise<UpdateBalanceUserInfoResponse>;
    /**
     * Update (async) a user's ticketz balance.
     *
     * @param request The updated ticketz balance.
     * @returns The update user ticket balance info
     * @throws An error if the user's ticketz balance cannot be updated.
     */
    updateTicketzBalance(request: UpdateTicketzBalanceRequest): Promise<UpdateTicketzUserInfoResponse>;
    /**
     * Get (async) a user's ticketz balance.
     *
     * @param request The get ticketz request
     * @returns The user's ticketz balance
     */
    getTicketzBalance(request: GetTicketzBalanceRequest): Promise<GetTicketzBalanceResponse>;
}
