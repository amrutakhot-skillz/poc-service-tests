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
const mocha_1 = require("mocha");
const authenticationService_1 = require("./authenticationService");
const expect_1 = __importDefault(require("expect"));
// Define configurations for specs
const config = {
    gameId: 3382,
    environment: 'qa',
};
const creds = {
    username: 'Yoohyeon',
    password: 'password',
};
(0, mocha_1.describe)('AuthenticationService', function () {
    (0, mocha_1.describe)('#getAuthToken()', function () {
        (0, mocha_1.it)('should return an auth token', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO: The connection should be mocked / stubbed.
                const authService = new authenticationService_1.AuthenticationService(config);
                const token = yield authService.fetchAuthToken(creds);
                // Match JWT token with regex
                (0, expect_1.default)(token.access_token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
                (0, expect_1.default)(token.token_type).toEqual('bearer');
                (0, expect_1.default)(token.refresh_token).toMatch(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
                (0, expect_1.default)(token.expires_in).toBeGreaterThan(0);
                (0, expect_1.default)(token.scope).toEqual('sdk');
            });
        });
    });
});
