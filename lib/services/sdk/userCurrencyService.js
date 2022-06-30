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
exports.UserCurrencyService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzSDKAPI_1 = __importDefault(require("./skillzSDKAPI"));
const logger = new logger_1.default(module);
class UserCurrencyService extends skillzSDKAPI_1.default {
    /**
     * Create the instance of the service.
     *
     * @param config The service's configuration.
     * @param authService instance of authentication service, used to authenticate requests
     */
    constructor(config, authService) {
        super(config);
        this.authService = authService;
    }
    /**
     * Retrieve User Currency
     *
     * @param user Current logged in user.
     * @returns Instance of UserCurrencyObject with the currency ISO code
     */
    getUserCurrency(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAuthorizationHeader(user, this.authService);
            try {
                const response = yield axios_1.default.get(this.baseURL + `/v1/user-currency`, {
                    headers: this.headerConfig.headers,
                });
                return response.data;
            }
            catch (e) {
                logger.logError(e);
                throw new Error('An error occurred while trying to fetch the User Currency.');
            }
        });
    }
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
    setUserCurrency(user, currencyISOCode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAuthorizationHeader(user, this.authService);
            try {
                const response = yield axios_1.default.post(this.baseURL + `/v1/user-currency`, { base_currency: currencyISOCode }, {
                    headers: this.headerConfig.headers,
                });
                return response.status === 201;
            }
            catch (error) {
                if (error.response.status === 409) {
                    logger.logWarn('Calling setCurrency on a user that already has their currency defined.');
                    return false;
                }
                else {
                    logger.logError(error);
                    throw new Error('An error occurred while trying to update the User Currency.');
                }
            }
        });
    }
}
exports.UserCurrencyService = UserCurrencyService;
