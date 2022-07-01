import { AuthenticationService } from './services/sdk/AuthenticationService';
import { LoginBonusService } from './services/sdk/loginBonusService';
import SkillzSDKAPI, { Configuration } from './services/sdk/skillzSDKAPI';
import SkillzPortalsAPI, { PortalsConfiguration } from './services/portals/skillzPortalsAPI';
import { UserCurrencyService } from './services/sdk/userCurrencyService';
import { UserManagementService } from './services/sdk/userManagementService';
import { PortalsAuthenticationService } from './services/portals/portalsAuthenticationService';
import { PlayerDetailsService } from './services/portals/playerDetailsService';


export { AuthenticationService, LoginBonusService, UserCurrencyService, UserManagementService, PortalsAuthenticationService, PlayerDetailsService, SkillzPortalsAPI, SkillzSDKAPI };
export type { Configuration, PortalsConfiguration };