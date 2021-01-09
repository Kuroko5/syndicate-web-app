import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AlertCardComponent } from './alert-card/alert-card.component';
import { CardItemComponent } from './card-list/card-item/card-item.component';
import { CardListComponent } from './card-list/card-list.component';
import { CardComponent } from './card.component';
import { ConditionCardComponent } from './condition-card/condition-card.component';
import { DefaultCardComponent } from './default-card/default-card.component';
import { EquipmentCardComponent } from './equipment-card/equipment-card.component';
import { MachineCardComponent } from './machine-card/machine-card.component';
import { ReportCardComponent } from './report-card/report-card.component';

@NgModule({
  declarations: [
    CardComponent,
    EquipmentCardComponent,
    CardListComponent,
    CardItemComponent,
    MachineCardComponent,
    AlertCardComponent,
    DefaultCardComponent,
    ReportCardComponent,
    ConditionCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MomentModule,
    PipesModule,
    I18NextModule.forRoot(),
    PermissionsModule,
  ],
  exports: [
    CardComponent,
    EquipmentCardComponent,
    CardListComponent,
    MachineCardComponent,
    AlertCardComponent,
    DefaultCardComponent,
    ReportCardComponent,
    ConditionCardComponent
  ],
  providers: []
})
export class CardsModule { }
