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
exports.AuthenticationService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzSDKAPI_1 = __importDefault(require("./skillzSDKAPI"));
const logger = new logger_1.default(module);
class AuthenticationService extends skillzSDKAPI_1.default {
    /**
     * Fetch (async) an authentication token to be used by other API calls.
     *
     * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
     *
     * @param credentials Credentials interface containing a username/password
     */
    fetchAuthToken(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = new URLSearchParams();
            // TODO: Move credentials into configuration.
            body.append('grant_type', 'password');
            body.append('username', credentials.username);
            body.append('password', credentials.password);
            body.append('scope', 'sdk');
            // TODO: Move URLs and game ids into configuration.
            try {
                const response = yield axios_1.default.post(this.baseURL + '/oauth/token', body, {
                    auth: {
                        username: this.configuration.gameId.toString(),
                        password: '',
                    },
                });
                return response.data;
            }
            catch (e) {
                logger.logError(e);
                throw new Error('ERROR: An error occurred while trying to fetch an auth token.');
            }
        });
    }
}
exports.AuthenticationService = AuthenticationService;
