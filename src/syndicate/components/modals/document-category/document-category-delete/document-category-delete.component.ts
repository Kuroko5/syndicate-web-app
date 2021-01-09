/**
 * Used to display the form to add or edit a document only
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NameFormatPipe } from 'src/syndicate/pipes/name-format.pipe';
import { AuthService } from 'src/syndicate/services/auth.service';
import { DocumentsCategoriesService } from 'src/syndicate/services/documents-categories.service';

@Component({
  templateUrl: './document-category-delete.component.html',
  styleUrls: ['./document-category-delete.component.scss'],
  providers: [
    NameFormatPipe,
  ]
})
export class DocumentCategoryDeleteComponent implements OnInit {


  public loading = false;
  public documentForm: FormGroup;
  public decodedToken = null;
  public categories = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<DocumentCategoryDeleteComponent>,
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
    const category = this.data.category ? this.data.category : null;
    this.documentForm = this.formBuilder.group({
      category: [category],
    });
  }

  ngOnInit() {
    this.fetchDocuments();
  }

  /**
   * Get documents with pagination and sorting
   */
  fetchDocuments(): void {
    this.documentsCategoriesService.getDocumentsCategories().subscribe(
      (documentsCategories) => {
        // exclude current DocumentCategory of array
        this.categories = documentsCategories.data.filter((c: any) => c._id !== this.data._id);
      },
      (error) => {
        console.log(error);
      });
  }

  /**
   */
  public onSubmit(): void {
    this.loading = true;

    // structure a new object with category to delete and the new category
    const data = {
      documentCategoryId: this.documentForm.controls.category.value
    };

    const categoryToDelete = this.data._id;

    this.deleteDocument(categoryToDelete, data);
  }

  /**
  * Delete a document
  * @param id The id of the current Document Category to delete
  * @param data object content the new documentCategoryId of transfert
  */
  deleteDocument(id: string, data: any): void {
    this.documentsCategoriesService.deleteDocumentCategory(id, data).subscribe(
      (result) => {
        this.dialogRef.close(result);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      },
    );
  }


}
