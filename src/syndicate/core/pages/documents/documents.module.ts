import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { I18NextModule } from 'angular-i18next';
import { ButtonModule } from 'src/syndicate/components/button/button.module';
import { ColorPickerModule } from 'src/syndicate/components/color-picker/colorPicker.module';
import { DataTableModule } from 'src/syndicate/components/dataTable/dataTable.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { DocumentComponent } from 'src/syndicate/components/modals/document/document.component';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { DocumentsCategoriesService } from 'src/syndicate/services/documents-categories.service';
import { DocumentsService } from 'src/syndicate/services/documents.service';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';


@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    HeaderModule,
    MaterialModule,
    MatFormFieldModule,
    ColorPickerModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    I18NextModule.forRoot(),
    ButtonModule
  ],
  providers: [DocumentsService, DocumentsCategoriesService],
  entryComponents: [
    DocumentComponent
  ]
})
export class DocumentsModule { }
