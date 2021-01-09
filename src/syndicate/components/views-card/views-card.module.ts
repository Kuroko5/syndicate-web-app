import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import * as cardsModule from 'src/syndicate/components/cards/cards.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { ViewsCardComponent } from './views-card.component';

@NgModule({
  declarations: [
    ViewsCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    cardsModule.CardsModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  exports: [ViewsCardComponent],
  providers: []
})
export class ViewsCardModule { }
