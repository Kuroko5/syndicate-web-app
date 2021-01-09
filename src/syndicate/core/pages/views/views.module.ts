import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18NextModule } from 'angular-i18next';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { ViewsCardModule } from 'src/syndicate/components/views-card/views-card.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { ConditionsService } from 'src/syndicate/services/conditions.service';
import { UsersService } from 'src/syndicate/services/users.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { DataTableModule } from '../../../components/dataTable/dataTable.module';
import { ViewsRoutingModule } from './views-routing.module';
import { ViewsComponent } from './views.component';

@NgModule({
  declarations: [
    ViewsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    ViewsRoutingModule,
    MatIconModule,
    ViewsCardModule,
    DataTableModule,
    MaterialModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  providers: [
    AlertsService,
    VariablesService,
    ConditionsService,
    UsersService
  ]
})
export class ViewsModule { }
