import axios from 'axios';
import Logger from '../../utilities/logger';
import { User, UserManagementService } from '../sdk/userManagementService';
import { PortalsAuthenticationService } from './portalsAuthenticationService';
import SkillzPortalsAPI, { PortalsConfiguration } from './skillzPortalsAPI';

const logger = new Logger(module);

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

export class PlayerDetailsService extends SkillzPortalsAPI {
  /**
   * Create a new instance of the service.
   *
   * @param config The service's configuration details.
   * @param authService An instance of the authentication service.
   */
  constructor(
    config: PortalsConfiguration,
    protected authService: PortalsAuthenticationService
  ) {
    super(config);
  }

  /**
   * Update (async) a user's balance. This includes cash, bonus cash, and
   * bonus points.
   *
   * @param request The balance data to update.
   * @returns The updated user's info.
   * @throws An error if the user's balance cannot be updated.
   */
  async updateBalance(
    request: BalanceRequest
  ): Promise<UpdateBalanceUserInfoResponse> {
    logger.logStep(
      `Updating user id ${request.user_id} by $${request.balance_deposit} cash, $${request.cash_bonus} bonus cash, and ${request.points_bonus} bonus points`
    );
    const authToken = await this.authService.fetchAuthToken();

    try {
      const response = await axios.post(
        this.apiGatewayBaseURL() + '/ap/v1/update_balance',
        request,
        {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        }
      );
      if (!response.data.resultReferences) {
        throw new Error(JSON.stringify(response, null, 2));
      }
      return response.data.resultReferences.user;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        `An error occurred while trying to update the user's balance.\n\
        ${JSON.stringify(e, null, 2)}`
      );
    }
  }

  /**
   * Set (async) a user's balance. This includes cash, bonus cash, and
   * bonus points.
   *
   * @param user The user to set balance
   * @param request The balance data to set.
   * @returns The updated user's info.
   * @throws An error if the user's balance cannot be set.
   */
  async setBalance(
    user: User,
    request: BalanceRequest
  ): Promise<UpdateBalanceUserInfoResponse> {
    logger.logStep(
      `Updating user id ${request.user_id} to $${request.balance_deposit} cash, $${request.cash_bonus} bonus cash, and ${request.points_bonus} bonus points`
    );
    const authToken = await this.authService.fetchAuthToken();

    const newRequest: BalanceRequest = {
      user_id: request.user_id,
      game_id: request.game_id,
      balance_deposit:
        request.balance_deposit - user.cash_balance + user.bonus_balance,
      cash_bonus: request.cash_bonus - user.bonus_balance,
      points_bonus: request.points_bonus - user.z_balance,
    };
    try {
      const response = await axios.post(
        this.apiGatewayBaseURL() + '/ap/v1/update_balance',
        newRequest,
        {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        }
      );
      if (!response.data.resultReferences) {
        throw new Error(response.data.messages);
      }

      return response.data.resultReferences.user;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        `An error occurred while trying to update the user's balance.\n\
        ${JSON.stringify(e, null, 2)}`
      );
    }
  }

  /**
   * Sanitary function of updateBalance. Adding user's cash balance
   *
   * @param userId The id of user.
   * @param amount The cash amount to be added.
   * @returns The updated user's info.
   * @throws An error if the user's balance cannot be updated.
   */
  async addCashBalance(
    userId: number,
    amount: number
  ): Promise<UpdateBalanceUserInfoResponse> {
    const request: BalanceRequest = {
      user_id: userId,
      balance_deposit: amount,
      cash_bonus: 0,
      points_bonus: 0,
    };
    try {
      return this.updateBalance(request);
    } catch (e) {
      throw new Error(
        "An error occurred while trying to add to the user's cash balance."
      );
    }
  }

  /**
   * Update (async) a user's ticketz balance.
   *
   * @param request The updated ticketz balance.
   * @returns The update user ticket balance info
   * @throws An error if the user's ticketz balance cannot be updated.
   */
  async updateTicketzBalance(
    request: UpdateTicketzBalanceRequest
  ): Promise<UpdateTicketzUserInfoResponse> {
    logger.logStep("Updating the user's ticketz balance.");

    const params = new URLSearchParams();
    params.append('userId', request.userId.toString());
    params.append('ticketz', request.ticketz.toString());
    const authHeader = await this.authService.getAuthHeader();

    try {
      const response = await axios.post(
        this.baseURL + '/ap/v1/adjust_ticketz_balance',
        {},
        {
          auth: authHeader,
          params: params,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.messages);
      }

      return response.data.resultReferences;
    } catch (e) {
      logger.logError(e);
      throw new Error(
        "An error occurred while trying to update the user's ticketz balance."
      );
    }
  }

  /**
   * Get (async) a user's ticketz balance.
   *
   * @param request The get ticketz request
   * @returns The user's ticketz balance
   */
  async getTicketzBalance(
    request: GetTicketzBalanceRequest
  ): Promise<GetTicketzBalanceResponse> {
    logger.logStep("Getting the user's ticketz balance.");

    const userInfo = await request.userService.getUserInfo({
      username: request.user.username,
      password: request.user.password,
    });

    return userInfo.ticketz;
  }
}
