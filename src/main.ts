import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { environment } from './environments/environment';
import { SyndicateModule } from './syndicate/syndicate.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SyndicateModule)
  .catch(err => console.error(err));
