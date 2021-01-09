import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import {
  DocumentCategoryDeleteComponent,
} from 'src/syndicate/components/modals/document-category/document-category-delete/document-category-delete.component';
import { InfoComponent } from 'src/syndicate/components/modals/info/info.component';
import { DocumentsCategoriesService } from 'src/syndicate/services/documents-categories.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage } from '../../../enums/storage';

@Component({
  selector: 'syndicate-documents-categories',
  templateUrl: './documents-categories.component.html',
  styleUrls: ['./documents-categories.component.scss']
})
export class DocumentsCategoriesComponent implements OnInit {
  public addObject = false;
  public pageName = '';
  public count = 0;
  public deletedDocumentIndex = null;
  public data: any;
  public maxlength = 30;
  public types: string[] = [];
  public type = '';
  public search = '';
  public defaultselect = 'all';
  public category = '';
  public errorUpdate: string = '';

  constructor(
    private dialog: MatDialog,
    private i18nextService: I18NextService,
    private documentsCategoriesService: DocumentsCategoriesService,
    private storageService: SyndicateStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.documents');
    this.fetchDocuments();
    this.fetchDocumentsTypes();
  }

  /**
   * Get documents with pagination and sorting
   */
  fetchDocuments(): void {
    this.documentsCategoriesService.getDocumentsCategories().subscribe(
      (documentsCategories) => {
        this.data = documentsCategories.data;
      },
      (error) => {
        console.log(error);
      });
  }

/**
   * Get documents with pagination and sorting
   */
  fetchDocumentsTypes(): void {
    this.documentsCategoriesService.getDocumentsTypes().subscribe(
      (documentsTypes) => {
        const data = documentsTypes.data;
        const listTypes = data.map((documentsTypes) => {
          return documentsTypes.label;
        });
        this.types = listTypes;
        this.storageService.storeInLocal(LocalStorage.SYNDICATE_TYPES_DOCUMENT, data);
      },
      (error) => {
        console.log(error);
      });
  }

  /**
   * Rename the category
   */
  rename(event, row): void {
    const data = {
      label: event.target.rename.value
    };
    if (data.label.length > this.maxlength) {
      this.dialog.open(InfoComponent, {
        data: {
          title: this.i18nextService.t('global.error'),
          message: this.i18nextService.t('documents.categories.error.maxlength')
        },
        width: '520px',
        height: 'auto',
        autoFocus: false
      });
    } else {
      if (data.label === row.label[0].label) {
        row.rename = false;
      } else {
        this.documentsCategoriesService.editDocumentCategory(row._id, data).subscribe(
          (res) => {
            if (res) {
              row.label = data.label;
              row.rename = false;
              delete row.error;
            }
          },
          (error) => {
            if (error.error.message === 'This category already exists') {
              row.error = this.i18nextService.t('documents.categories.error.label');
            }
          },
        );
      }
    }
  }

  /**
   * Set variable to show HTML rename block
   */
  renameEditor(row): void {
    row.rename = true;
  }

  onDelete(data): void {
    this.openDeleteDocumentDialog(data);
  }
  /**
  * Open the document dialog to add or edit
  * @param data Data to display in the Document Dialog
  * @param mode Add or Edit mode
  */
  openDeleteDocumentDialog(data): void {
    const documentDialogRef = this.dialog.open(DocumentCategoryDeleteComponent, {
      data: { ...data },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    documentDialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.fetchDocuments();
      }
    });
  }
  /**
   * Rename the category
   */
  add(event): void {
    const data = {
      label: event.target.add.value
    };
    if (data.label.length > this.maxlength) {
      this.dialog.open(InfoComponent, {
        data: {
          title: this.i18nextService.t('global.error'),
          message: this.i18nextService.t('documents.categories.error.maxlength')
        },
        width: '520px',
        height: 'auto',
        autoFocus: false
      });
    }

    this.documentsCategoriesService.addDocumentCategory(data).subscribe(
      (res) => {
        if (res) {
          this.fetchDocuments();
          this.addObject = false;
        }
      },
      (error) => {
        if (error.error.message === 'This category already exists') {
          this.dialog.open(InfoComponent, {
            data: {
              title: this.i18nextService.t('global.error'),
              message: this.i18nextService.t('documents.categories.error.label')
            },
            width: '520px',
            height: 'auto',
            autoFocus: false
          });
        }
      },
    );
  }

  /**
   * Set type of the documents for searchbar
   * @param event Event of the output
   */
  onSelected(event): void {
    const data = {
      search: this.search,
      type: event,
      category: this.category
    };
    this.router.navigate(['/documents', data]).catch((error) => {
      return new Error(error);
    });
  }

  /**
   * Value from the SearchBar
   * @param value Value of the searchBar
   */
  onSend(value): void {
    this.search = value;
    if (this.type === '') {
      this.type = 'all';
    }

    const data = {
      search: this.search,
      type: this.type,
      category: this.category
    };

    this.router.navigate(['/documents', data]).catch((error) => {
      return new Error(error);
    });
  }
  /**
   * Navigate to the document page
   * Recover documentCategoryId to open all documents.
   */
  onGoToPage(category): void {
    const data = {
      search: '',
      type: '',
      category: category._id,
      label: category.label
    };
    this.router.navigate(['/documents', data]);
    return;
  }
}
