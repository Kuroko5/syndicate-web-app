import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { DocumentComponent } from 'src/syndicate/components/modals/document/document.component';
import { DocumentsService } from 'src/syndicate/services/documents.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage, SessionStorage } from '../../../enums/storage';


@Component({
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  public pageName = '';
  public data: any;
  public count = 0;
  public deletedDocumentIndex = null;
  public types: string[] = [];
  public search = '';
  public type = '';
  public category = '';
  public label: string = '';
  constructor(
    private dialog: MatDialog,
    private i18nextService: I18NextService,
    private sessionStorage: SyndicateStorageService,
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.documents');
    const allTypes = this.sessionStorage.fetchInLocal(LocalStorage.SYNDICATE_TYPES_DOCUMENT);
    const listLabels = allTypes.map((documentsTypes) => {
      return documentsTypes.label;
    });
    this.types = listLabels;
    const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DOCUMENTS);
    this.route.params.subscribe((params: any) => {
      if (params) {
        this.category = params.category;
        this.search = params.search;
        this.type  = params.type;
        this.label = params.label;
        if (!this.type || !this.types.includes(this.type)) {
          this.type = 'all';
        }
        this.fetchDocuments(1, 25, -1, 'createdAt', this.search, this.type, this.category);
      } else {
        if (sorting) {
          this.fetchDocuments(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.search, sorting.select, sorting.category);
        } else {
          this.fetchDocuments(1, 25, 1, 'createdAt', '', 'all', 'id');
        }
      }
    });
  }

  /**
   * Get documents with pagination and sorting
   * @param page The desired page
   * @param limit The number of the displayed data
   * @param sort The applied sort
   * @param column The selected column to apply the sort
   */
  fetchDocuments(page: number, limit: number, sort: number, column: string, search: string, type: string, category: string): void {
    this.documentsService.getDocuments(page, limit, sort, column, type, search, category).subscribe(
      (documents) => {
        this.data = documents.data.result;
        this.count = documents.data.count;
        if (this.data) {
          this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_DOCUMENTS, {
            page,
            limit,
            sort,
            column,
            category,
            select: type,
          });
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  /**
 * Refresh the documents datatable with the desired sort and pagination
 * @param event Contains the desired page, limit, sort and column to apply on documents
 */
  onRefreshData(event): void {
    event.category = this.category;
    this.fetchDocuments(event.page, event.limit, event.sort, event.column, event.search, event.select, event.category);
  }
  /**
   * Open Modal to create new document
   * Set default data
   */
  onAddDocument(): void {

    const data = {
      title: '',
      documentType: null,
      operator: '',
      documentCategory: this.category ? { _id : this.category } : null
    };

    this.openDocumentDialog(data, 'add');
  }

  /**
 * Open the document dialog to add or edit
 * @param data Data to display in the Document Dialog
 * @param mode Add or Edit mode
 */
  openDocumentDialog(data, mode: string): void {
    const documentDialogRef = this.dialog.open(DocumentComponent, {
      data: { ...data, mode },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    documentDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DOCUMENTS);
        this.fetchDocuments(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.search, sorting.select, sorting.category);
      }
    });
  }

  /**
   * Get the linked file and display its on new window tab
   * @param event The selected item
   */
  onDisplayDetail(event): void {
    this.documentsService.displayDocument(event._id).subscribe(
      (file) => {
        if (file) {
          const blob = new Blob([file], { type: event.fileType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          window.URL.revokeObjectURL(url);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  /**
   * Open confirmation dialog to remove the selected document
   * @param event The selected document to remove
   */
  onRemoveDocument(event): void {
    const confirmDialog = this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('documents.delete.confirmation')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.deletedDocumentIndex = event.index;
        this.documentsService.deleteDocument(event.row._id).subscribe(
          (res) => {
            if (res) {
              this.deletedDocumentIndex = null;
              const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DOCUMENTS);
              this.fetchDocuments(
                sorting.page,
                sorting.limit,
                sorting.sort,
                sorting.column,
                sorting.search,
                sorting.select,
                sorting.category);
            }
          },
          (error) => {
            console.log(error);
            this.deletedDocumentIndex = null;
          },
        );
      }
    });
  }

  /**
   * Edit the selected document metadata
   * @param event The selected document
   */
  onEditDocument(event): void {
    this.documentsService.getDocumentById(event._id).subscribe(
      (document) => {
        this.openDocumentDialog(document.data, 'edit');
      },
      (error) => {
        console.log(error);
      },
    );
  }

  /**
   * Go to previous page
   */
  back(): void {
    this.location.back();
  }
  ngOnDestroy() {
    this.search = '';
  }
}
