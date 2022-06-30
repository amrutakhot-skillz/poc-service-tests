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
exports.LoginBonusService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzSDKAPI_1 = __importDefault(require("./skillzSDKAPI"));
const logger = new logger_1.default(module);
class LoginBonusService extends skillzSDKAPI_1.default {
    /**
     * Create an instance of the service.
     *
     * @param config The service's configuration.
     * @param authService An instance of AuthenticationService.
     * @param user A user as returned by UserManagementService.
     */
    constructor(config, authService, user) {
        super(config);
        this.authService = authService;
        this.user = user;
    }
    /**
     * Claim a Login Bonus.
     *
     * @returns A Login Bonus API response
     * @throws An error if the Login Bonus could not be claimed
     */
    claimBonus() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logInfo(`Using the API to claim a Login Bonus with an empty POST`);
            const authToken = yield this.authService.fetchAuthToken({
                username: this.user.username,
                password: this.user.password,
            });
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            try {
                const response = yield axios_1.default.post(this.baseURL + `/v1/login_bonus/claim`, {}, {
                    headers: this.headerConfig.headers,
                });
                const loginBonus = response.data;
                if (!loginBonus) {
                    throw new Error(`The Login Bonus could not be claimed.`);
                }
                logger.logInfo(`${JSON.stringify(loginBonus)}`);
                return loginBonus;
            }
            catch (e) {
                if (e['response']) {
                    logger.logInfo(`Status: ${e['response'].status}`);
                    logger.logError(JSON.stringify(e['response'].data, null, 2));
                    throw new Error('An error occurred while trying to claim Login Bonus');
                }
                throw e;
            }
        });
    }
}
exports.LoginBonusService = LoginBonusService;
