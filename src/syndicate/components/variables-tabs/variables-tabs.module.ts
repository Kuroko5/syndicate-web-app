import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { DataTableModule } from '../dataTable/dataTable.module';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { ConditionSelectorComponent } from '../modals/condition-selector/condition-selector.component';
import { VariableSelectorComponent } from '../modals/variable-selector/variable-selector.component';
import { VariableComponent } from '../modals/variable/variable.component';
import { SearchBarModule } from '../searchBar/searchBar.module';
import { SelectModule } from '../select/select.module';
import { VariablesGraphModule } from '../variables-graph/variables-graph.module';
import { CounterTabComponent } from './counter-tab/counter-tab.component';
import { HistoryTabComponent } from './history-tab/history-tab.component';
import { VariableTabComponent } from './variable-tab/variable-tab.component';
import { VariablesTabsComponent } from './variables-tabs.component';

@NgModule({
  declarations: [
    VariablesTabsComponent,
    VariableComponent,
    VariableSelectorComponent,
    ConditionSelectorComponent,
    CounterTabComponent,
    VariableTabComponent,
    HistoryTabComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DataTableModule,
    DatepickerModule,
    SearchBarModule,
    SelectModule,
    VariablesGraphModule,
    MomentModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  exports: [
    VariablesTabsComponent,
    VariableSelectorComponent,
    ConditionSelectorComponent
  ],
  providers: [VariablesService],
  entryComponents: [
    VariableComponent
  ]
})
export class VariablesTabsModule { }
