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
const userCurrencyService_1 = require("./userCurrencyService");
const authenticationService_1 = require("./authenticationService");
const userManagementService_1 = require("./userManagementService");
const expect_1 = __importDefault(require("expect"));
const config = {
    gameId: 8626,
    environment: 'staging',
};
(0, mocha_1.describe)('UserCurrencyService', function () {
    // Timeout for the entire suite to run
    this.timeout(20000);
    (0, mocha_1.describe)('#getUserCurrency', function () {
        (0, mocha_1.it)('returns the User Currency through the SDK', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const authService = new authenticationService_1.AuthenticationService(config);
                const userCurrencyService = new userCurrencyService_1.UserCurrencyService(config, authService);
                const userService = new userManagementService_1.UserManagementService(config, authService, userCurrencyService);
                const user = yield userService.createNewUser();
                const sdkResponse = yield userCurrencyService.getUserCurrency(user);
                (0, expect_1.default)(sdkResponse.base_currency).toEqual('USD'); // Default User should have 'USD' as base_currency
            });
        });
    });
    (0, mocha_1.describe)('#setUserCurrency', function () {
        (0, mocha_1.it)('sets the User Currency through the SDK', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const authService = new authenticationService_1.AuthenticationService(config);
                const userCurrencyService = new userCurrencyService_1.UserCurrencyService(config, authService);
                const userService = new userManagementService_1.UserManagementService(config, authService, userCurrencyService);
                const user = yield userService.createNewUser(null); // passing null intentionally to allow setCurrency to be tested below
                let sdkResponse = yield userCurrencyService.getUserCurrency(user);
                (0, expect_1.default)(sdkResponse.base_currency).toEqual('USD'); // Default User should have 'USD' as base_currency
                const success = yield userCurrencyService.setUserCurrency(user, 'INR');
                (0, expect_1.default)(success).toBeTruthy();
                sdkResponse = yield userCurrencyService.getUserCurrency(user);
                (0, expect_1.default)(sdkResponse.base_currency).toEqual('INR'); // Modified User should have 'INR' as base_currency
            });
        });
    });
});
