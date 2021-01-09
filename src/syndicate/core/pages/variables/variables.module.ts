import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { VariablesTabsModule } from 'src/syndicate/components/variables-tabs/variables-tabs.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { VariablesRoutingModule } from './variables-routing.module';
import { VariablesComponent } from './variables.component';

@NgModule({
  declarations: [
    VariablesComponent
  ],
  imports: [
    CommonModule,
    VariablesRoutingModule,
    HeaderModule,
    MaterialModule,
    VariablesTabsModule,
    I18NextModule.forRoot()
  ],
  providers: [],
})
export class VariablesModule { }
