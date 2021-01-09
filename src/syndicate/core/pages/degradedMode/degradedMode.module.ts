import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { DegradedModeService } from 'src/syndicate/services/degradedMode.service';
import { DegradedModeRoutingModule } from './degradedMode-routing.module';
import { DegradedModeComponent } from './degradedMode.component';

@NgModule({
  declarations: [
    DegradedModeComponent,
  ],
  imports: [
    CommonModule,
    DegradedModeRoutingModule,
    HeaderModule,
    MatExpansionModule,
    MaterialModule,
    MomentModule,
    I18NextModule.forRoot()
  ],
  providers: [DegradedModeService],
})
export class DegradedModeModule { }
