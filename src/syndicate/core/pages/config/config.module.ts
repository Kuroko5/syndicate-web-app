import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { ConfigTabsModule } from 'src/syndicate/components/config-tabs/config-tabs.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';

@NgModule({
  declarations: [
    ConfigComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    ConfigRoutingModule,
    ConfigTabsModule,
    I18NextModule.forRoot(),
  ]
})
export class ConfigModule { }
