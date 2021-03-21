declare let window: any;

/**
 * DynamicEnvironment class
 *
 * Use this class for common environment variables between the local and production environment.
 * Create a getter with the same name as the key on the file in `assets/environment/app-config.json`
 *
 * Don't use setter, it's a bad practice
 */
export class DynamicEnvironment {
  /**
   * environment getter
   *
   * @return a string
   */
  public get environment(): string {
    return window.config.ENVIRONMENT;
  }

  /**
   * api_url getter
   *
   * @return a string
   */
  public get api_url(): string {
    return window.config.API_URL;
  }

  public get timer(): number {
    return window.config.TIMER;
  }
}
