import { describe, it } from 'mocha';
import { UserCurrencyService } from './userCurrencyService';
import { AuthenticationService } from './authenticationService';
import { Configuration } from './skillzSDKAPI';
import { UserManagementService } from './userManagementService';
import expect from 'expect';

const config: Configuration = {
  gameId: 8626,
  environment: 'staging',
};

describe('UserCurrencyService', function () {
  // Timeout for the entire suite to run
  this.timeout(20000);
  describe('#getUserCurrency', function () {
    it('returns the User Currency through the SDK', async function () {
      const authService = new AuthenticationService(config);
      const userCurrencyService = new UserCurrencyService(config, authService);
      const userService = new UserManagementService(
        config,
        authService,
        userCurrencyService
      );
      const user = await userService.createNewUser();

      const sdkResponse = await userCurrencyService.getUserCurrency(user);
      expect(sdkResponse.base_currency).toEqual('USD'); // Default User should have 'USD' as base_currency
    });
  });

  describe('#setUserCurrency', function () {
    it('sets the User Currency through the SDK', async function () {
      const authService = new AuthenticationService(config);
      const userCurrencyService = new UserCurrencyService(config, authService);
      const userService = new UserManagementService(
        config,
        authService,
        userCurrencyService
      );
      const user = await userService.createNewUser(null); // passing null intentionally to allow setCurrency to be tested below

      let sdkResponse = await userCurrencyService.getUserCurrency(user);
      expect(sdkResponse.base_currency).toEqual('USD'); // Default User should have 'USD' as base_currency
      const success = await userCurrencyService.setUserCurrency(user, 'INR');
      expect(success).toBeTruthy();
      sdkResponse = await userCurrencyService.getUserCurrency(user);
      expect(sdkResponse.base_currency).toEqual('INR'); // Modified User should have 'INR' as base_currency
    });
  });
});
