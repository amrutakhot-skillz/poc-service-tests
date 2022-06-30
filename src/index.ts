import {AuthenticationService} from './services/sdk/AuthenticationService';
import { LoginBonusService } from './services/sdk/loginBonusService';
import SkillzSDKAPI, { Configuration } from './services/sdk/skillzSDKAPI';
import { UserCurrencyService } from './services/sdk/userCurrencyService';
import { UserManagementService } from './services/sdk/userManagementService';

export default{AuthenticationService, LoginBonusService, SkillzSDKAPI, UserCurrencyService, UserManagementService};
export type {Configuration};