import { DynamicEnvironment } from './dynamic-environment';

/**
 * Environment class
 *
 * For the local environment only, use the file environment.ts
 * For the prod environment only, use this file
 * For both environments, use the file dynamic-environment.ts
 */
class Environment extends DynamicEnvironment {
  public production: boolean;

  constructor() {
    super();
    this.production = true;
  }
}

export const environment = new Environment();
