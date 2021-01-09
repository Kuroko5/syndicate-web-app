import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { I18NextModule } from 'angular-i18next';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { ButtonModule } from '../../../components/button/button.module';
import { DataTableModule } from '../../../components/dataTable/dataTable.module';
import { HeaderModule } from '../../../components/header/header.module';
import { VariableSelectorComponent } from '../../../components/modals/variable-selector/variable-selector.component';
import { MaterialModule } from '../../../material/material.module';
import { StationService } from '../../../services/station.service';
import { VariablesModule } from '../variables/variables.module';
import { HardwareArchitectureFormComponent } from './hardware-architecture-form/hardware-architecture-form.component';
import { HardwareArchitectureRoutingModule } from './hardware-architecture-routing.module';
import { HardwareArchitectureComponent } from './hardware-architecture.component';
import {
  HardwareSchemeCardDetailComponent
} from './hardware-scheme/hardware-scheme-card/hardware-scheme-card-detail.component/hardware-scheme-card-detail.component';
import { HardwareSchemeCardComponent } from './hardware-scheme/hardware-scheme-card/hardware-scheme-card.component';
import { HardwareSchemeLineComponent } from './hardware-scheme/hardware-scheme-line/hardware-scheme-line.component';
import { HardwareSchemeNodeComponent } from './hardware-scheme/hardware-scheme-node/hardware-scheme-node.component';
import { HardwareSchemeComponent } from './hardware-scheme/hardware-scheme.component';

@NgModule({
  declarations: [
    HardwareArchitectureComponent,
    HardwareSchemeCardComponent,
    HardwareSchemeCardDetailComponent,
    HardwareSchemeComponent,
    HardwareSchemeLineComponent,
    HardwareSchemeNodeComponent,
    HardwareArchitectureFormComponent
  ],
  imports: [
    CommonModule,
    HardwareArchitectureRoutingModule,
    HeaderModule,
    MaterialModule,
    ButtonModule,
    MatFormFieldModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    VariablesModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  providers: [
    StationService,
  ],
  entryComponents: [
    HardwareSchemeCardDetailComponent,
    VariableSelectorComponent,
  ]
})
export class HardwareArchitectureModule { }
