/**
 * Used to display the form to add or edit a document only
 */
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NameFormatPipe } from 'src/syndicate/pipes/name-format.pipe';
import { AuthService } from 'src/syndicate/services/auth.service';
import { DocumentsCategoriesService } from 'src/syndicate/services/documents-categories.service';
import { DocumentsService } from 'src/syndicate/services/documents.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage } from '../../../enums/storage';

@Component({
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  providers: [
    NameFormatPipe,
  ]
})
export class DocumentComponent implements OnInit {

  private operator: string;

  public loading = false;
  public documentForm: FormGroup;
  public decodedToken = null;
  public types = [];
  public categories : any;
  public selectedFile = null;
  public tooLarge = false;
  public progress = 0;
  public documentType: string;
  public documentCategoryId: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<DocumentComponent>,
    private nameFormatPipe: NameFormatPipe,
    private storageService: SyndicateStorageService,
    private documentsService: DocumentsService,
    private documentsCategoriesService: DocumentsCategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.decodedToken = this.authService.decodeToken();
    this.buildForm();
  }

  /**
   * Setup the metadata form with default value
   */
  private buildForm(): void {
    this.operator = this.data.operator !== '' ? this.data.operator : this.decodedToken.username;
    this.documentType = this.data.documentType ? this.data.documentType._id : null;
    this.documentCategoryId = this.data.documentCategory ? this.data.documentCategory._id : null;

    this.documentForm = this.formBuilder.group({
      title: [this.data.title, [Validators.required]],
      documentTypeId: [this.documentType, [Validators.required]],
      documentCategoryId: [this.documentCategoryId, [Validators.required]],
      operator: [this.nameFormatPipe.transform(this.operator)]
    });
  }

  ngOnInit() {
    this.types = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_TYPES_DOCUMENT);
    this.fetchDocumentsCategories();
  }

  /**
   * Add / Edit document action
   */
  public onSubmit(): void {
    this.loading = true;

    this.documentForm.patchValue({ operator: this.operator });

    // The metadata and the file are sent as a FormData
    const uploadData = new FormData();

    if (this.selectedFile) {
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
      uploadData.append('fileName', this.selectedFile.name);
      uploadData.append('fileType', this.selectedFile.type);
    }

    // We go through the form to add each field to the FormData
    for (const key in this.documentForm.controls) {
      if (this.documentForm.controls.hasOwnProperty(key)) {
        uploadData.append(key, this.documentForm.controls[key].value);
      }
    }

    switch (this.data.mode) {
      case 'add':
        this.addDocument(uploadData);
        break;
      case 'edit':
        this.editDocument(uploadData);
        break;
      default:
        console.log('Wrong mode selected');
        this.loading = false;
        break;
    }
  }

  /**
   * Add a document
   */
  addDocument(uploadData): void {
    this.documentsService.uploadDocument(uploadData).subscribe((event: HttpEvent<any>) => {
      this.uploadProgress(event);
    },                                                         (error) => {
      console.log(error);
      this.loading = false;
    });
  }

  /**
   * Edit the current document
   */
  editDocument(uploadData): void {
    this.documentsService.editDocument(this.data._id, uploadData).subscribe((event: HttpEvent<any>) => {
      this.uploadProgress(event);
    },                                                                      (error) => {
      console.log(error);
      this.loading = false;
    });
  }

  /**
   * Event of the progress file upload
   * Display the Spinner
   * @param event Progress upload event
   */
  uploadProgress(event) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.progress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.loading = false;
        this.progress = 0;
        this.dialogRef.close(event);
        break;
      default:
        this.loading = false;
        this.progress = 0;
        break;
    }
  }

  /**
   * File selection
   * @param event change's event
   */
  public onFileChanged(event: any): void {
    this.tooLarge = false;
    const file = event.target.files[0];

    if (file.size >= 150000000) {
      this.tooLarge = true;
    } else {
      this.tooLarge = false;
      this.selectedFile = file;
    }
  }

  /**
   * Get all documents categories
   */
  fetchDocumentsCategories(): void {
    this.documentsCategoriesService.getDocumentsCategories().subscribe(
      (documentsCategories) => {
        this.categories = documentsCategories.data;
      },
      (error) => {
        console.log(error);
      });
  }
}
