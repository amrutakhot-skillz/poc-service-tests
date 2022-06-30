import { AuthenticationService } from './services/sdk/AuthenticationService';
import { LoginBonusService } from './services/sdk/loginBonusService';
import SkillzSDKAPI, { Configuration } from './services/sdk/skillzSDKAPI';
import { UserCurrencyService } from './services/sdk/userCurrencyService';
import { UserManagementService } from './services/sdk/userManagementService';
declare const _default: {
    AuthenticationService: typeof AuthenticationService;
    LoginBonusService: typeof LoginBonusService;
    SkillzSDKAPI: typeof SkillzSDKAPI;
    UserCurrencyService: typeof UserCurrencyService;
    UserManagementService: typeof UserManagementService;
};
export default _default;
export type { Configuration };
