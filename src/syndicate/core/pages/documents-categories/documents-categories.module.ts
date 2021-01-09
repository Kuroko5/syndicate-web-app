import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { I18NextModule } from 'angular-i18next';
import { ButtonModule } from 'src/syndicate/components/button/button.module';
import { DataTableModule } from 'src/syndicate/components/dataTable/dataTable.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import {
  DocumentCategoryDeleteComponent,
} from 'src/syndicate/components/modals/document-category/document-category-delete/document-category-delete.component';
import { DocumentCategoryComponent } from 'src/syndicate/components/modals/document-category/document-category.component';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { DocumentsCategoriesService } from 'src/syndicate/services/documents-categories.service';
import { SearchBarModule } from '../../../components/searchBar/searchBar.module';
import { SelectModule } from '../../../components/select/select.module';
import { DocumentsCategoriesRoutingModule } from './documents-categories-routing.module';
import { DocumentsCategoriesComponent } from './documents-categories.component';

@NgModule({
  declarations: [
    DocumentsCategoriesComponent,
    DocumentCategoryDeleteComponent,
    DocumentCategoryComponent
  ],
  imports: [
    CommonModule,
    DocumentsCategoriesRoutingModule,
    HeaderModule,
    MaterialModule,
    ButtonModule,
    MatFormFieldModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    PermissionsModule,
    SearchBarModule,
    SelectModule,
    I18NextModule.forRoot()
  ],
  providers: [DocumentsCategoriesService],
  entryComponents: [
    DocumentsCategoriesComponent,
    DocumentCategoryDeleteComponent
  ]
})
export class DocumentsCategoriesModule { }
