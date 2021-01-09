/**
 * Used to display the form to add or edit a device only
 */
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotificationService } from 'src/syndicate/services/notification.service';
import { VariablesService } from 'src/syndicate/services/variables.service';

@Component({
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: []
})
export class ImportComponent implements OnInit {

  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;

  public file: any;
  public selectedFile: any;
  public loading: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private variableService: VariablesService,
    public dialogRef: MatDialogRef<ImportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit(): void {
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFile($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(file) {
    console.log('browse handler', file);
    this.prepareFile(file);
  }

  /**
   * Delete file from files list
   */
  deleteFile() {
    if (this.file.progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.file = null;
  }

  /**
   * Simulate the upload process
   */
  uploadFile() {
    this.loading = true;

    // The metadata and the file are sent as a FormData
    const uploadData = new FormData();

    console.log(this.selectedFile);
    if (this.selectedFile) {
      console.log('in if');
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
      uploadData.append('fileName', this.selectedFile.name);
      uploadData.append('fileType', this.selectedFile.type);
    }

    // console.log('upload data', ...uploadData);
    for (const p of uploadData) {
      console.log('key', p);
    }

    this.variableService.import(uploadData).subscribe(
      {
        next: (event) => {
          console.log('event in upload', event);
          this.uploadProgress(event);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      }
    );

    // setTimeout(() => {
    //   if (this.file) {
    //     return;
    //   }  {
    //     const progressInterval = setInterval(() => {
    //       if (this.file.progress === 100) {
    //         clearInterval(progressInterval);
    //       } else {
    //         this.file.progress += 5;
    //       }
    //     },200);
    //   }
    // },         1000);
  }


  /**
   * Event of the progress file upload
   * Display the Spinner
   * @param event Progress upload event
   */
  uploadProgress(event) {
    console.log('file in progress', this.file);
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.file.progress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.loading = false;
        this.file.progress = 0;
        this.dialogRef.close(event);
        break;
      default:
        this.loading = false;
        console.log('Defaulkt upload progress', this.file);
        // this.file.progress = 0;
        break;
    }
  }

  /**
   * Convert File
   * @param files (File)
   */
  prepareFile(event: any) {
    this.file = event.target.files[0];

    this.file.progress = 0;
    console.log('file to prepare', this.file);

    this.selectedFile = this.file;
    this.fileDropEl.nativeElement.value = '';
    this.uploadFile();
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
