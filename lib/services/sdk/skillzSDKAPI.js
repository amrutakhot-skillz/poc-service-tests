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
const logger_1 = __importDefault(require("../../utilities/logger"));
const serviceInterceptor_1 = __importDefault(require("../../utilities/serviceInterceptor"));
const logger = new logger_1.default(module);
class SkillzSDKAPI {
    /**
     * Construct a new instance of the SDK API
     *
     * @param configuration contains a game id and environment to setup the base URL
     */
    constructor(configuration) {
        this.configuration = configuration;
        /**
         * Set the default headers for SDK requests
         *
         * TODO: Generate randomized device id
         */
        this.headerConfig = {
            headers: {
                'X-Skillz-Sdk-Version': '28.0.543',
                'X-Skillz-OS-Version': '14.1',
                'X-Skillz-Ota-Version': '28.0.100',
                'X-Skillz-Game': this.configuration.gameId,
                'X-Skillz-Retry-After-Millis': 2000,
                'X-Skillz-iOS-IFA': 'DC4D1635-82AD-4570-B533-E14B97A84172',
                'X-Skillz-iOS-Bundle-Id': 'com.skillz.enterprise.test.radium.nightly.debug',
                'X-Skillz-Request-Queue-Date': new Date().toISOString(),
                'X-Skillz-Platform': 'iOS',
                'X-Skillz-Device': 'iPhone13,4 (iPhone13,4)',
                'X-Skillz-iOS-IFV': 'D6651185-C3F3-45A9-BF55-81104E47AEED',
                'Skillz-secure': 'true',
                'X-Skillz-Transaction-Id': 'd1404076-bed0-41a3-94b4-fc5a8d963f65',
                'X-Skillz-App-Fingerprint': '$ios$app$100000c0000$16aa$170008130000|eca77977c35d58f87e1b798a55004bfb4587ea371af3690bc5e5fd21',
                'X-Skillz-Fingerprint': 'Fingerprint',
                'X-Skillz-Device-Id': SkillzSDKAPI.deviceIdHeader,
                'X-Skillz-Location': '45.533125,-122.684161,' + new Date().toISOString(),
                'Skillz-Timezone-Offset': '-07:00',
                'X-Skillz-iOS-Ad-Tracking-Disabled': '0',
                'Accept-Language': 'en;q=1',
                'X-Skillz-State': '0',
            },
        };
        /**
         * Set the default device configuration for SDK requests
         */
        this.deviceInformation = {
            gps: true,
            id: this.headerConfig.headers['X-Skillz-Device-Id'],
            location_services: true,
            mock_location: false,
            network_location: true,
            rooted: false,
            wifi: true,
        };
        /**
         * Set the default max amount of times to retry an API call
         */
        this.maxRetries = 2;
        /**
         * Track the current amount of times we have retried the current API call
         */
        this.retryCount = 0;
        /**
         * Set the interval of time in between API call retries
         * Format time in milliseconds (ms)
         */
        this.retryInterval = 2000;
        this.baseURL = `https://${this.configuration.gameId}.ts.${this.configuration.environment}.skillz.com`;
        // TODO: make this setup part of Appium and Mocha startup https://skillzinc.atlassian.net/browse/PS-49139
        serviceInterceptor_1.default.setupFingerprintInterceptor(configuration);
    }
    /**
     * Retry an API call up to maxRetries amount of times, with retryInterval between each call
     *
     * @param fn Function to call when retrying
     * @param e Error passed in from original function, used to output original error even after retries
     * @returns Promise from original function
     * @throws Error if maximum amount of retries is reached
     */
    retry(fn, e) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.logWarn(`Retrying last api call from function: ${fn.name}`);
            if (this.retryCount >= this.maxRetries) {
                this.resetRetryCount();
                throw e;
            }
            this.retryCount += 1;
            yield this.sleep(this.retryInterval);
            return fn();
        });
    }
    /**
     * Reset the retryCount for retrying API calls to 0
     */
    resetRetryCount() {
        this.retryCount = 0;
    }
    /**
     * Waits a given amount of milliseconds before moving on
     *
     * @param ms Milliseconds to wait before moving on
     * @returns Promise that resolves when the sleep completes
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Sets the authorization header
     *
     * @param {User} user User object to set auth values against
     * @param {AuthenticationService} authService AuthenticationService class that creates the JWT token.
     */
    setAuthorizationHeader(user, authService) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = yield authService.fetchAuthToken({
                username: user.username,
                password: user.password,
            });
            this.headerConfig.headers['Authorization'] = `Bearer ${authToken.access_token}`;
        });
    }
}
exports.default = SkillzSDKAPI;
/**
 * Device ID constant to be shared with the Fingerprint Service to generate fingerprint tokens
 */
SkillzSDKAPI.deviceIdHeader = '86127AB9-6998-4975-8B8A-B966E021D316';
