import { AuthenticationService } from './authenticationService';
import { UserManagementService } from './userManagementService';
import { LoginBonusService } from './loginBonusService';
import expect from 'expect';
import { UserCurrencyService } from './userCurrencyService';

const config = {
  gameId: 8626,
  environment: 'staging',
};

const SIXTY_SECONDS_IN_MS = 60000;

describe('LoginBonusService', function () {
  this.timeout(SIXTY_SECONDS_IN_MS);

  describe('#claimLoginBonus()', function () {
    it('should claim the Login Bonus', async function () {
      const authService = new AuthenticationService(config);
      const userCurrencyService = new UserCurrencyService(config, authService);
      const userManagementService = new UserManagementService(
        config,
        authService,
        userCurrencyService
      );
      const user = await userManagementService.createNewUser();

      const loginBonusService = new LoginBonusService(
        config,
        authService,
        user
      );
      const loginBonus = await loginBonusService.claimBonus();

      expect(loginBonus.color).toContain('#');
      expect(loginBonus.type).not.toEqual('');
      expect(loginBonus.amount).toBeGreaterThan(0);
      expect(loginBonus.seconds_to_login_bonus).toBeGreaterThan(0);
      expect(loginBonus.login_bonus_cooldown).toBeGreaterThan(0);
    });
  });
});
