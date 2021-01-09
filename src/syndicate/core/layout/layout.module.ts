import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { MaterialModule } from '../../material/material.module';
import { NavigationComponent } from '../navigation/navigation.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent,
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  exports: [],
  providers: [SyndicateStorageService]
})
export class LayoutModule { }
