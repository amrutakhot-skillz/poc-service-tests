"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDetailsService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzPortalsAPI_1 = __importDefault(require("./skillzPortalsAPI"));
const logger = new logger_1.default(module);
class PlayerDetailsService extends skillzPortalsAPI_1.default {
    /**
     * Create a new instance of the service.
     *
     * @param config The service's configuration details.
     * @param authService An instance of the authentication service.
     */
    constructor(config, authService) {
        super(config);
        this.authService = authService;
    }
    /**
     * Update (async) a user's balance. This includes cash, bonus cash, and
     * bonus points.
     *
     * @param request The balance data to update.
     * @returns The updated user's info.
     * @throws An error if the user's balance cannot be updated.
     */
    updateBalance(request) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logStep(`Updating user id ${request.user_id} by $${request.balance_deposit} cash, $${request.cash_bonus} bonus cash, and ${request.points_bonus} bonus points`);
            const authToken = yield this.authService.fetchAuthToken();
            try {
                const response = yield axios_1.default.post(this.apiGatewayBaseURL() + '/ap/v1/update_balance', request, {
                    headers: { Authorization: `Bearer ${authToken.access_token}` },
                });
                if (!response.data.resultReferences) {
                    throw new Error(JSON.stringify(response, null, 2));
                }
                return response.data.resultReferences.user;
            }
            catch (e) {
                logger.logError(e);
                throw new Error(`An error occurred while trying to update the user's balance.\n\
        ${JSON.stringify(e, null, 2)}`);
            }
        });
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
    setBalance(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logStep(`Updating user id ${request.user_id} to $${request.balance_deposit} cash, $${request.cash_bonus} bonus cash, and ${request.points_bonus} bonus points`);
            const authToken = yield this.authService.fetchAuthToken();
            const newRequest = {
                user_id: request.user_id,
                game_id: request.game_id,
                balance_deposit: request.balance_deposit - user.cash_balance + user.bonus_balance,
                cash_bonus: request.cash_bonus - user.bonus_balance,
                points_bonus: request.points_bonus - user.z_balance,
            };
            try {
                const response = yield axios_1.default.post(this.apiGatewayBaseURL() + '/ap/v1/update_balance', newRequest, {
                    headers: { Authorization: `Bearer ${authToken.access_token}` },
                });
                if (!response.data.resultReferences) {
                    throw new Error(response.data.messages);
                }
                return response.data.resultReferences.user;
            }
            catch (e) {
                logger.logError(e);
                throw new Error(`An error occurred while trying to update the user's balance.\n\
        ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    /**
     * Sanitary function of updateBalance. Adding user's cash balance
     *
     * @param userId The id of user.
     * @param amount The cash amount to be added.
     * @returns The updated user's info.
     * @throws An error if the user's balance cannot be updated.
     */
    addCashBalance(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                user_id: userId,
                balance_deposit: amount,
                cash_bonus: 0,
                points_bonus: 0,
            };
            try {
                return this.updateBalance(request);
            }
            catch (e) {
                throw new Error("An error occurred while trying to add to the user's cash balance.");
            }
        });
    }
    /**
     * Update (async) a user's ticketz balance.
     *
     * @param request The updated ticketz balance.
     * @returns The update user ticket balance info
     * @throws An error if the user's ticketz balance cannot be updated.
     */
    updateTicketzBalance(request) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logStep("Updating the user's ticketz balance.");
            const params = new URLSearchParams();
            params.append('userId', request.userId.toString());
            params.append('ticketz', request.ticketz.toString());
            const authHeader = yield this.authService.getAuthHeader();
            try {
                const response = yield axios_1.default.post(this.baseURL + '/ap/v1/adjust_ticketz_balance', {}, {
                    auth: authHeader,
                    params: params,
                });
                if (!response.data.success) {
                    throw new Error(response.data.messages);
                }
                return response.data.resultReferences;
            }
            catch (e) {
                logger.logError(e);
                throw new Error("An error occurred while trying to update the user's ticketz balance.");
            }
        });
    }
    /**
     * Get (async) a user's ticketz balance.
     *
     * @param request The get ticketz request
     * @returns The user's ticketz balance
     */
    getTicketzBalance(request) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logStep("Getting the user's ticketz balance.");
            const userInfo = yield request.userService.getUserInfo({
                username: request.user.username,
                password: request.user.password,
            });
            return userInfo.ticketz;
        });
    }
}
exports.PlayerDetailsService = PlayerDetailsService;
