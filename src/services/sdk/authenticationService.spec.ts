import { describe, it } from 'mocha';
import { AuthenticationService, Credentials } from './authenticationService';
import expect from 'expect';
import { Configuration } from './skillzSDKAPI';

// Define configurations for specs
const config: Configuration = {
  gameId: 3382,
  environment: 'qa',
};
const creds: Credentials = {
  username: 'Yoohyeon',
  password: 'password',
};

describe('AuthenticationService', function () {
  describe('#getAuthToken()', function () {
    it('should return an auth token', async function () {
      // TODO: The connection should be mocked / stubbed.
      const authService = new AuthenticationService(config);
      const token = await authService.fetchAuthToken(creds);

      // Match JWT token with regex
      expect(token.access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );
      expect(token.token_type).toEqual('bearer');
      expect(token.refresh_token).toMatch(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
      expect(token.expires_in).toBeGreaterThan(0);
      expect(token.scope).toEqual('sdk');
    });
  });
});
