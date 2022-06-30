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
exports.PortalsAuthenticationService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const skillzPortalsAPI_1 = __importDefault(require("./skillzPortalsAPI"));
const logger = new logger_1.default(module);
class PortalsAuthenticationService extends skillzPortalsAPI_1.default {
    /**
     * Returns the users secret key for the configured portal & environment
     *
     * @returns {string} Returns the client secret key for portals endpoints
     */
    getClientSecret() {
        const secretKey = process.env[`${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_KEY`];
        if (!secretKey) {
            throw new Error('An error occurred while trying to fetch the users secret key.');
        }
        return secretKey;
    }
    /**
     * Returns the secret key for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The secret key for Admin Portal modules
     */
    getAPSecret() {
        const secretKey = process.env[`${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_SECRET`];
        if (!secretKey) {
            throw new Error('An error occurred while trying to fetch the admin portal modules secret key.');
        }
        return secretKey;
    }
    /**
     * Returns the client id for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    getAPClientID() {
        const clientID = process.env[`${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_CLIENT_ID`];
        if (!clientID) {
            throw new Error('An error occurred while trying to fetch the admin portal modules client id.');
        }
        return clientID;
    }
    /**
     * Returns the shared username for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    getAPUsername() {
        const username = process.env[`${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_USERNAME`];
        if (!username) {
            throw new Error('An error occurred while trying to fetch the admin portal modules username.');
        }
        return username;
    }
    /**
     * Returns the shared password for Admin Portal modules.
     * This is needed for obtaining a JWT token from the Admin Portal.
     *
     * @returns {string} The UID for Admin Portal modules
     */
    getAPPassword() {
        const password = process.env[`${this.configuration.portalScope.toUpperCase()}_${this.configuration.environment.toUpperCase()}_PASSWORD`];
        if (!password) {
            throw new Error('An error occurred while trying to fetch the admin portal modules password.');
        }
        return password;
    }
    /**
     * Fetch (async) an authentication token to be used by other API calls.
     *
     * TODO: Cache the auth token per user for other services to use instead of re-calling everytime
     */
    fetchAuthToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = new URLSearchParams();
            body.append('client_id', this.configuration.portalScope);
            body.append('grant_type', 'client_credentials');
            body.append('client_secret', this.getClientSecret());
            body.append('scope', this.configuration.portalScope);
            try {
                const response = yield axios_1.default.post(this.apiGatewayBaseURL() + '/oauth/token', body, {
                    auth: {
                        username: this.configuration.portalScope,
                        password: this.getClientSecret(),
                    },
                });
                return response.data;
            }
            catch (e) {
                logger.logStep(e);
                throw new Error('An error occurred while trying to fetch an auth token.');
            }
        });
    }
    /**
     * Fetch (async) an authentication token to be used by API calls that are used in Admin Portal modules.
     *
     * @returns {APAuthToken} The JWT token for the Admin Portal
     */
    fetchAPAuthToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(this.adminPortalBaseURL() + '/oauth/token', {
                    grant_type: 'password',
                    client_id: this.getAPClientID(),
                    client_secret: this.getAPSecret(),
                    username: this.getAPUsername(),
                    password: this.getAPPassword(),
                });
                return response.data;
            }
            catch (e) {
                logger.logStep(e);
                throw new Error('An error occurred while trying to fetch an auth token.');
            }
        });
    }
    /**
     * Gets the Basic Auth Header
     *
     * @returns The username and password of the Portals Basic Auth
     */
    getAuthHeader() {
        return {
            username: this.configuration.portalScope,
            password: this.getClientSecret(),
        };
    }
}
exports.PortalsAuthenticationService = PortalsAuthenticationService;
