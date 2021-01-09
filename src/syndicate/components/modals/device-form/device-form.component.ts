/**
 * Used to display the form to add or edit a device only
 */
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DevicesService } from 'src/syndicate/services/devices.service';
import { NotificationService } from 'src/syndicate/services/notification.service';

@Component({
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
  providers: []
})
export class DeviceFormComponent implements OnInit {

  public deviceForm: FormGroup;
  public _id: string;
  public constructionId: string;
  public machineId: string;
  public equipmentId: string;
  public ip: string;
  public rack: number;
  public slot: number;
  public period: number;

  constructor(
    private devicesService: DevicesService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DeviceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  /**
   * Setup the metadata form with default value
   */
  private buildForm(): void {
    this._id = this.data._id ? this.data._id : null;
    this.constructionId = this.data.constructionId ? this.data.constructionId : null;
    this.machineId = this.data.machineId ? this.data.machineId : null;
    this.equipmentId = this.data.equipmentId ? this.data.equipmentId : null;
    this.ip = this.data.ip ? this.data.ip : null;
    this.rack = this.data.rack || this.data.rack > -1 ? this.data.rack : null;
    this.slot = this.data.slot || this.data.slot > -1 ? this.data.slot : null;
    this.period = this.data.period || this.data.period > -1 ? this.data.period : null;

    this.deviceForm = this.formBuilder.group({
      _id: [this._id, [Validators.required]],
      ip: [this.ip, [Validators.required]],
      constructionId: [this.constructionId, [Validators.required]],
      machineId: [this.machineId, [Validators.required]],
      equipmentId: [this.equipmentId, [Validators.required]],
      rack: [this.rack, [Validators.required, Validators.min(0)]],
      slot: [this.slot, [Validators.required, Validators.min(0)]],
      period: [this.period, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Add / Edit device action
   */
  public onSubmit(): void {
    switch (this.data.mode) {
      case 'add':
        this.addDevice(this.deviceForm.value);
        break;
      case 'edit':
        this.editDevice(this.deviceForm.value);
        break;
      default:
        console.log('Wrong mode selected');
        break;
    }
  }

  /**
   * Add a document
   */
  addDevice(body: any): void {
    this.devicesService.addDevice(body).subscribe(
      (event: HttpEvent<any>) => {
        this.dialogRef.close(event);
      },
      (error: any) => {
        this.notificationService.error(error.error.message);
      }
    );
  }

  /**
   * Edit the current document
   */
  editDevice(body: any): void {
    this.devicesService.editDevice(this.data._id, body).subscribe(
      (event: HttpEvent<any>) => {
        this.dialogRef.close(event);
      },
      (error: any) => {
        this.notificationService.error(error.error.message);
      }
    );
  }
}
