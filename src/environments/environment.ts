import { DynamicEnvironment } from './dynamic-environment';

/**
 * Environment class
 *
 * For the local environment only, use this file
 * For the prod environment only, use the file environment.prod.ts
 * For both environments, use the file dynamic-environment.ts
 */
class Environment extends DynamicEnvironment {
  public production: boolean;

  constructor() {
    super();
    this.production = false;
  }
}

export const environment = new Environment();
