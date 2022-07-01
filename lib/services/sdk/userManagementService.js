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
exports.UserManagementService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzSDKAPI_1 = __importDefault(require("./skillzSDKAPI"));
const logger = new logger_1.default(module);
const userGpsLocation = {
    US: '45.533125,-122.684161,',
    CANADA: '49.2827,-123.1207,',
};
class UserManagementService extends skillzSDKAPI_1.default {
    /**
     * Create a new UserManagementService instance, defines protected variables
     *
     * @param {Configuration} config Configuration
     * @param {AuthenticationService} authTokenService instance of authentication service, used to authenticate requests
     * @param {UserCurrencyService} userCurrencyService instance of user currency service, used to set or get user currency
     */
    constructor(config, authTokenService, userCurrencyService) {
        super(config);
        this.authTokenService = authTokenService;
        this.userCurrencyService = userCurrencyService;
    }
    /**
     * Create (async) a new user on the Skillz SDK and automatically defaults currency to USD.
     *
     * @param currencyISOCode (Optional) Automatically set currency to USD unless parameter is overridden. Pass null to skip setting the currency.
     * @param country (Optional) Sets user gps location to US unless parameter is overridden.
     */
    createNewUser(currencyISOCode = 'USD', country = 'US') {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Move this to logStep common package https://skillzinc.atlassian.net/browse/PS-33127
            logger.logStep('Creating a new user.');
            if (country == 'Canada') {
                this.headerConfig.headers['X-Skillz-Location'] =
                    userGpsLocation.CANADA + new Date().toISOString();
            }
            try {
                const response = yield axios_1.default.post(this.baseURL + '/v1/users', {
                    password: 'password',
                }, {
                    headers: this.headerConfig.headers,
                    auth: {
                        username: this.configuration.gameId.toString(),
                        password: '',
                    },
                });
                logger.logInfo(`Created user: ${response.data.username}`);
                logger.logInfo(`User ID: ${response.data.id}`);
                response.data.password = 'password';
                if (currencyISOCode) {
                    this.userCurrencyService.setUserCurrency(response.data, currencyISOCode);
                }
                if (country) {
                    this.setLocation(response.data);
                }
                return response.data;
            }
            catch (e) {
                logger.logInfo(`Status: ${(_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status}`);
                logger.logInfo((_b = e === null || e === void 0 ? void 0 : e.response) === null || _b === void 0 ? void 0 : _b.data);
                throw new Error('ERROR: An error occurred while trying to fetch a new user.');
            }
        });
    }
    /**
     * Saves a birthdate for the given user - required before saving an account
     *
     * @param user User from created or logged in user
     * @param birthDate Birthdate in format YYYY-MM-DD, defaults to valid birthdate
     */
    saveBirthDate(user, birthDate = '1992-12-17') {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = {
                username: user.username,
                password: user.password,
            };
            const authToken = yield this.authTokenService.fetchAuthToken(creds);
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            try {
                const response = yield axios_1.default.patch(this.baseURL + `/v1/users/${user.id}/personal`, {
                    birth_date: birthDate,
                }, {
                    headers: this.headerConfig.headers,
                });
                logger.logInfo(`Updated birth_date: ${response.data.birth_date}`);
                return response.data;
            }
            catch (e) {
                logger.logInfo(`Status: ${e['response'].status}`);
                logger.logInfo(e['response'].data);
                throw new Error('ERROR: An error occurred while trying to update user birthdate.');
            }
        });
    }
    /**
     * Saves a given User's account in the SDK
     *
     * @param user User interface passed from created user
     * @param creds Credentials interface containing a username and password
     * @param options Optional, additional save account configuration
     */
    saveAccount(user, creds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = yield this.authTokenService.fetchAuthToken(creds);
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            logger.logStep(`Saving account information for user: ${creds.username}.`);
            try {
                const response = yield axios_1.default.patch(this.baseURL + `/v1/users/${user.id}`, {
                    email: (options === null || options === void 0 ? void 0 : options.emailAddress)
                        ? options.emailAddress
                        : `automation+${creds.username}@skillz.com`,
                    password: creds.password,
                    old_password: creds.password,
                    email_opt_in: (options === null || options === void 0 ? void 0 : options.emailOptIn) ? options.emailOptIn : false,
                }, {
                    headers: this.headerConfig.headers,
                });
                return response.data;
            }
            catch (e) {
                logger.logError(e);
                throw new Error('ERROR: An error occurred while trying to save the user account.');
            }
        });
    }
    /**
     * Gets a given User's account info in the SDK
     *
     * @param creds Credentials interface containing a username and password
     */
    getUserInfo(creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = yield this.authTokenService.fetchAuthToken(creds);
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            logger.logStep(`Receiving account information for user: ${creds.username}.`);
            try {
                const response = yield axios_1.default.get(this.baseURL + `/v1/user`, {
                    headers: this.headerConfig.headers,
                });
                const user = response.data;
                user.password = creds.password;
                return user;
            }
            catch (e) {
                logger.logInfo(`Status: ${e['response'].status}`);
                logger.logInfo(e['response'].data);
                throw new Error('ERROR: An error occurred while trying to get the user account information.');
            }
        });
    }
    /**
     * Update player's username.
     *
     * @param user User to update.
     * @param creds User's credentials
     */
    updateUsername(user, creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = yield this.authTokenService.fetchAuthToken(creds);
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            logger.logStep(`Updating username for: ${creds.username} to ${user.username}.`);
            try {
                const response = yield axios_1.default.patch(this.baseURL + `/v1/users/${user.id}`, {
                    username: user.username,
                }, {
                    headers: this.headerConfig.headers,
                });
                return response.data;
            }
            catch (e) {
                logger.logError(e);
                throw new Error('ERROR: An error occurred while trying to update the user username.');
            }
        });
    }
    /**
     * Get (async) a user's segment membership, given their id and the target segment id
     *
     * @param request The request to get user membership for segment id
     * @throws An error if the user's segment membership cannot be retrieved
     */
    getUserSegmentMembership(request) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logStep("Getting the user's segment membership.");
            const user_ids = [parseInt(request.user.id)];
            const segment_ids = [request.segmentId];
            const realRequest = {
                user_ids: user_ids,
                segment_ids: segment_ids,
            };
            const creds = {
                username: request.user.username,
                password: request.user.password,
            };
            const authToken = yield this.authTokenService.fetchAuthToken(creds);
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            try {
                const response = yield axios_1.default.post(`${this.baseURL}/v1/segment_membership?=`, realRequest, {
                    headers: this.headerConfig.headers,
                });
                return response.data.user_ids;
            }
            catch (e) {
                logger.logError(e);
                throw new Error("An error occurred while trying to get the user's segment membership.");
            }
        });
    }
    /**
     * Update player's last known location.
     *
     * @param user User to update.
     */
    setLocation(user) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logInfo(`Using the API to claim a Login Bonus with an empty POST`);
            const authToken = yield this.authTokenService.fetchAuthToken({
                username: user.username,
                password: user.password,
            });
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
            try {
                const response = yield axios_1.default.post('http://location-service.internal.staging.cloud.skillz.com/user-location', {
                    user_id: user.id,
                }, {
                    headers: this.headerConfig.headers,
                });
                return response.status === 200;
            }
            catch (e) {
                throw new Error(e + 'An error occurred while trying to set user location');
            }
        });
    }
}
exports.UserManagementService = UserManagementService;
