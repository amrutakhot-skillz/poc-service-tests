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
const axios_1 = __importDefault(require("axios"));
const fingerprintService_1 = __importDefault(require("../services/internal/fingerprintService"));
class ServiceInterceptor {
    /**
     * Initializes the axios request interceptor.
     * Currently it adds the rotating fingerprint token but can be expanded for more common functionality.
     *
     * @param configuration Configuration object with game ID and environment
     */
    static setupFingerprintInterceptor(configuration) {
        const fingerprintService = new fingerprintService_1.default(configuration);
        ServiceInterceptor.currentConfiguration = configuration;
        if (ServiceInterceptor.interceptorInitialized) {
            // interceptor is global for all axios requests, so we must set it only once
            return;
        }
        ServiceInterceptor.interceptorInitialized = true;
        axios_1.default.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // uncomment the proxy object below to intercept API calls with Charles
            config.proxy = {
                host: 'localhost',
                port: 8888,
            };
            if (config.url.includes('game-administration-service') ||
                config.url.includes('nginx.ts') ||
                ((_a = config.data) === null || _a === void 0 ? void 0 : _a.scope) === 'ap' ||
                ((_b = config.data) === null || _b === void 0 ? void 0 : _b.scope) === 'ep') {
                // don't add fingerprint token on requests to portal APIs
                return config;
            }
            config.headers['skillz-fingerprint-token'] =
                yield fingerprintService.getEncryptedToken();
            return config;
        }));
    }
}
exports.default = ServiceInterceptor;
/**
 * Static flag to determined whether axios request interceptor has been setup. It must be setup only once for the lifetime of the test run.
 */
ServiceInterceptor.interceptorInitialized = false;
