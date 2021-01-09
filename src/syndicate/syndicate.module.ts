import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import {
  I18NEXT_SERVICE,
  I18NextLoadResult,
  I18NextModule,
  ITranslationService
} from 'angular-i18next';
import * as i18nextLanguageDetector from 'i18next-browser-languagedetector';
import i18nextXhrBackend from 'i18next-xhr-backend';
import { MomentModule } from 'ngx-moment';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { AlertComponent } from './components/modals/alert/alert.component';
import { ConditionComponent } from './components/modals/condition/condition.component';
import { ConfirmComponent } from './components/modals/confirm/confirm.component';
import { DescriptionComponent } from './components/modals/description/description.component';
import { DeviceComponent } from './components/modals/device/device.component';
import { InfoComponent } from './components/modals/info/info.component';
import { PingComponent } from './components/modals/ping/ping.component';
import { PositionComponent } from './components/modals/position/position.component';
import { ProfileDescriptionComponent } from './components/modals/profile-description/profile-description.component';
import { UserDescriptionComponent } from './components/modals/user-description/user-description.component';
import { LoginComponent } from './core/pages/login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { PipesModule } from './pipes/pipes.module';
import { SyndicateRoutingModule } from './routing/syndicate-routing.module';
import { AuthService } from './services/auth.service';
import { ListsService } from './services/lists.service';
import { IconsService } from './services/loadIcons.service';
import { NotificationService } from './services/notification.service';
import { SyndicateStorageService } from './services/storage.service';
import { SyndicateComponent } from './syndicate.component';
import { SyndicateInitService } from './syndicate.init';

export function initApp(appLoadService: SyndicateInitService) {
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
    SyndicateComponent,
    LoginComponent,
    ConditionComponent,
    AlertComponent,
    DescriptionComponent,
    ConfirmComponent,
    UserDescriptionComponent,
    ProfileDescriptionComponent,
    InfoComponent,
    PingComponent,
    PositionComponent,
    DeviceComponent,
  ],
  imports: [
    BrowserModule,
    SyndicateRoutingModule,
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
    PermissionsModule,
    MatExpansionModule,
    DragDropModule,
    MatSnackBarModule,
    I18NextModule.forRoot()
  ],
  providers: [
    I18N_PROVIDERS,
    IconsService,
    AuthService,
    SyndicateInitService,
    ListsService,
    SyndicateStorageService,
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SyndicateInitService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  entryComponents: [
    ConditionComponent,
    AlertComponent,
    DescriptionComponent,
    ConfirmComponent,
    UserDescriptionComponent,
    ProfileDescriptionComponent,
    InfoComponent,
    PingComponent,
    PositionComponent,
    DeviceComponent,
  ],
  bootstrap: [SyndicateComponent]
})
export class SyndicateModule { }
