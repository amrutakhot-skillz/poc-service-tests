import axios, { AxiosRequestConfig } from 'axios';
import FingerprintService from '../services/internal/fingerprintService';
import { Configuration } from '../services/sdk/skillzSDKAPI';
export default class ServiceInterceptor {
  /**
   * Static flag to determined whether axios request interceptor has been setup. It must be setup only once for the lifetime of the test run.
   */
  protected static interceptorInitialized = false;

  /**
   * Configuration object with game ID and environment.
   */
  protected static currentConfiguration: Configuration;

  /**
   * Initializes the axios request interceptor.
   * Currently it adds the rotating fingerprint token but can be expanded for more common functionality.
   *
   * @param configuration Configuration object with game ID and environment
   */
  static setupFingerprintInterceptor(configuration: Configuration): void {
    const fingerprintService = new FingerprintService(configuration);
    ServiceInterceptor.currentConfiguration = configuration;
    if (ServiceInterceptor.interceptorInitialized) {
      // interceptor is global for all axios requests, so we must set it only once
      return;
    }
    ServiceInterceptor.interceptorInitialized = true;
    axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
      // uncomment the proxy object below to intercept API calls with Charles
      config.proxy = {
        host: 'localhost',
        port: 8888,
      };

      if (
        config.url.includes('game-administration-service') ||
        config.url.includes('nginx.ts') ||
        config.data?.scope === 'ap' ||
        config.data?.scope === 'ep'
      ) {
        // don't add fingerprint token on requests to portal APIs
        return config;
      }

      config.headers['skillz-fingerprint-token'] =
        await fingerprintService.getEncryptedToken();
      return config;
    });
  }
}
