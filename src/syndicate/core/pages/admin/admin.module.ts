import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18NextModule } from 'angular-i18next';
import { AdminTabsModule } from 'src/syndicate/components/admin-tabs/admin-tabs.module';
import { ColorPickerModule } from 'src/syndicate/components/color-picker/colorPicker.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { ButtonModule } from '../../../components/button/button.module';
import { ConditionSelectorComponent } from '../../../components/modals/condition-selector/condition-selector.component';
import { VariableSelectorComponent } from '../../../components/modals/variable-selector/variable-selector.component';
import { MaterialModule } from '../../../material/material.module';
import { VariablesModule } from '../variables/variables.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardFormComponent } from './dashboard-form/dashboard-form.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ViewCardFormComponent } from './view-form/view-card-form/view-card-form.component';
import { ViewFormComponent } from './view-form/view-form.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardFormComponent,
    ProfileFormComponent,
    UserFormComponent,
    ViewFormComponent,
    ViewCardFormComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AdminRoutingModule,
    AdminTabsModule,
    ColorPickerModule,
    I18NextModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule,
    ButtonModule,
    VariablesModule,
    DragDropModule,
  ],
  entryComponents: [
    VariableSelectorComponent,
    ConditionSelectorComponent
  ]
})
export class AdminModule { }
