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
const authenticationService_1 = require("./authenticationService");
const userManagementService_1 = require("./userManagementService");
const loginBonusService_1 = require("./loginBonusService");
const expect_1 = __importDefault(require("expect"));
const userCurrencyService_1 = require("./userCurrencyService");
const config = {
    gameId: 8626,
    environment: 'staging',
};
const SIXTY_SECONDS_IN_MS = 60000;
describe('LoginBonusService', function () {
    this.timeout(SIXTY_SECONDS_IN_MS);
    describe('#claimLoginBonus()', function () {
        it('should claim the Login Bonus', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const authService = new authenticationService_1.AuthenticationService(config);
                const userCurrencyService = new userCurrencyService_1.UserCurrencyService(config, authService);
                const userManagementService = new userManagementService_1.UserManagementService(config, authService, userCurrencyService);
                const user = yield userManagementService.createNewUser();
                const loginBonusService = new loginBonusService_1.LoginBonusService(config, authService, user);
                const loginBonus = yield loginBonusService.claimBonus();
                (0, expect_1.default)(loginBonus.color).toContain('#');
                (0, expect_1.default)(loginBonus.type).not.toEqual('');
                (0, expect_1.default)(loginBonus.amount).toBeGreaterThan(0);
                (0, expect_1.default)(loginBonus.seconds_to_login_bonus).toBeGreaterThan(0);
                (0, expect_1.default)(loginBonus.login_bonus_cooldown).toBeGreaterThan(0);
            });
        });
    });
});
