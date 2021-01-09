/**
 * Used to display the form to create or edit a report only
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NameFormatPipe } from 'src/syndicate/pipes/name-format.pipe';
import { AuthService } from 'src/syndicate/services/auth.service';
import { ReportsService } from 'src/syndicate/services/reports.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage } from '../../../enums/storage';

@Component({
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    NameFormatPipe,
  ]
})
export class ReportComponent implements OnInit {

  private operator: string;

  public loading = false;
  public reportForm: FormGroup;
  public decodedToken = null;
  public types = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private reportsService: ReportsService,
    public dialogRef: MatDialogRef<ReportComponent>,
    private nameFormatPipe: NameFormatPipe,
    private storageService: SyndicateStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.decodedToken = this.authService.decodeToken();
    this.buildForm();
  }

  /**
   * Setup the metadata form with default value
   */
  private buildForm(): void  {

    this.operator = this.data.operator !== '' ? this.data.operator : this.decodedToken.username;
    const reportTypeId = this.data.reportType ? this.data.reportType._id : null;

    this.reportForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      reportTypeId: [reportTypeId, [Validators.required]],
      operator: [this.nameFormatPipe.transform(this.operator)],
      description: [this.data.description, [Validators.required]]
    });
  }

  ngOnInit() {
    this.types = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_TYPES);
  }

  /**
   * Create / Edit report action
   */
  public onSubmit(): void {
    this.loading = true;
    switch (this.data.mode) {
      case 'create':
        this.createReport();
        break;
      case 'edit':
        this.editReport();
        break;
      default:
        console.log('Wrong mode selected');
        this.loading = false;
        break;
    }
  }

  /**
   * Create a new report
   */
  createReport(): void {
    this.reportForm.patchValue({ operator: this.operator });

    this.reportsService.createReport(this.reportForm.value).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.dialogRef.close(res);
      }
    },                                                                (error) => {
      console.log(error);
      this.loading = false;
    });
  }

  /**
   * Edit the current report
   */
  editReport(): void {
    this.reportForm.patchValue({ operator: this.operator });

    this.reportsService.editReport(this.data._id, this.reportForm.value).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.dialogRef.close(res);
      }
    },                                                                             (error) => {
      console.log(error);
      this.loading = false;
    });
  }
}
