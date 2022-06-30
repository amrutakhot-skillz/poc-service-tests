"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class SkillzPortalsAPI {
    /**
     * Construct a new instance of the Portals API
     *
     * @param configuration Portal API settings
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.baseURL = `https://nginx.ts.${this.configuration.environment}.skillz.com`;
    }
    /**
     * Overrides the base URL to not use nginx.ts as a prefix
     *
     * @returns {string} Returns the base url
     */
    apiGatewayBaseURL() {
        if (this.configuration.environment.toLowerCase() == 'staging') {
            return `https://${this.configuration.environment}.skillz.com`;
        }
        else {
            return this.baseURL;
        }
    }
    /**
     * Overrides the base URL to not use nginx.ts as a prefix
     *
     * @returns {string} Returns the base url that is API Gateway 2 specific
     */
    apiGateway2BaseURL() {
        if (this.configuration.environment.toLowerCase() == 'staging') {
            return `https://gateway.us-east-1.${this.configuration.environment}.cloud.skillz.com`;
        }
        else if (this.configuration.environment.toLowerCase() == 'qa') {
            return `https://gateway.us-east-1.dev.cloud.skillz.com`;
        }
        else {
            return this.baseURL;
        }
    }
    /**
     * Returns the base URL for the Admin Portal based on environment
     *
     * @returns {string} The base URL for the Admin Portal
     */
    adminPortalBaseURL() {
        return `https://admin.${this.configuration.environment.toLowerCase()}.skillz.com`;
    }
    /**
     * Generate a new moment 30 seconds in the future to use as the start time
     *
     * @returns Formatted string for time
     */
    getStartTimeNow() {
        return (0, moment_1.default)().add(30, 'seconds').utc().format();
    }
}
exports.default = SkillzPortalsAPI;
