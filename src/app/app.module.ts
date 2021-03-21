
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
} from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import {
  I18NextLoadResult,
  I18NextModule,
  I18NEXT_SERVICE,
  ITranslationService
} from 'angular-i18next';

import { JwtInterceptor } from '@auth0/angular-jwt';
import * as i18nextLanguageDetector from 'i18next-browser-languagedetector';
import i18nextXhrBackend from 'i18next-xhr-backend';
import { MomentModule } from 'ngx-moment';

import { AppInitService } from './app.init';
import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { PipesModule } from './pipes/pipes.module';
import { AuthService } from './services/auth.service';
import { IconsService } from './services/loadIcons.service';
import { NotificationService } from './services/notification.service';
import { SyndicateStorageService } from './services/storage.service';


export function initApp(appLoadService: AppInitService) {
  return () => appLoadService.init();
}

const i18nextOptions = {
  whitelist: ['fr', 'en'],
  fallbackLng: 'fr',
  debug: false, // set debug?
  returnEmptyString: false,
  ns: [
    'translation',
  ],
  backend: {
    loadPath: 'assets/locales/{{lng}}/{{ns}}.json'
  }
};

export function appInit(i18next: ITranslationService) {
  return () => {
    const promise: Promise<I18NextLoadResult> = i18next
      .use(i18nextXhrBackend)
      .use(i18nextLanguageDetector)
      .init(i18nextOptions);
    return promise;
  };
}

export function localeIdFactory(i18next: ITranslationService) {
  return i18next.language;
}

export const I18N_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [I18NEXT_SERVICE],
    multi: true
  },
  {
    provide: LOCALE_ID,
    deps: [I18NEXT_SERVICE],
    useFactory: localeIdFactory
  },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    PagesModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MomentModule,
    PipesModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSnackBarModule,
    I18NextModule.forRoot()
  ],
  providers: [
    I18N_PROVIDERS,
    IconsService,
    AuthService,
    AppInitService,
    SyndicateStorageService,
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
