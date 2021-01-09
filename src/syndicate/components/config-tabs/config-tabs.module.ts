import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { I18NextModule } from 'angular-i18next';
import { VariablesModule } from 'src/syndicate/core/pages/variables/variables.module';
import { DndDirective } from 'src/syndicate/directives/dnd.directive';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { CountersService } from 'src/syndicate/services/counters.service';
import { DevicesService } from 'src/syndicate/services/devices.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { DataTableModule } from '../dataTable/dataTable.module';
import { CounterFormComponent } from '../modals/counter-form/counter-form.component';
import { DeviceFormComponent } from '../modals/device-form/device-form.component';
import { ImportComponent } from '../modals/import/import.component';
import { VariableFormComponent } from '../modals/variable-form/variable-form.component';
import { VariableSelectorComponent } from '../modals/variable-selector/variable-selector.component';
import { ConfigTabsComponent } from './config-tabs.component';
import { CounterTabComponent } from './counter-tab/counter-tab.component';
import { DeviceTabComponent } from './device-tab/device-tab.component';
import { VariableTabComponent } from './variable-tab/variable-tab.component';

@NgModule({
  declarations: [
    ConfigTabsComponent,
    DndDirective,
    DeviceTabComponent,
    DeviceFormComponent,
    ImportComponent,
    VariableTabComponent,
    VariableFormComponent,
    CounterTabComponent,
    CounterFormComponent
  ],
  imports: [
    CommonModule,
    DataTableModule,
    MaterialModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PermissionsModule,
    VariablesModule,
    I18NextModule.forRoot(),
  ],
  providers: [
    DevicesService,
    VariablesService,
    CountersService
  ],
  entryComponents: [
    DeviceFormComponent,
    CounterFormComponent,
    ImportComponent,
    VariableSelectorComponent,
    VariableFormComponent
  ],
  exports: [ConfigTabsComponent]
})
export class ConfigTabsModule { }
