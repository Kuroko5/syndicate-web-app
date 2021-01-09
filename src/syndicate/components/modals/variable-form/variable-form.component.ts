/**
 * Used to display the form to add or edit a variable only
 */
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DevicesService } from 'src/syndicate/services/devices.service';
import { NotificationService } from 'src/syndicate/services/notification.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { VariableType } from '../../../enums/variable-type.enum';

@Component({
  templateUrl: './variable-form.component.html',
  styleUrls: ['./variable-form.component.scss'],
  providers: []
})
export class VariableFormComponent implements OnInit {

  public variableForm: FormGroup;
  public vId: string;
  public format: string;
  public category: string;
  public type: string;
  public deviceId: string;
  public advice: string;
  public descr: string;
  public unit: string;
  public memorySlot: number;
  public location: string;
  public enable: boolean;
  public isVisible: boolean;

  public variableType: typeof VariableType = VariableType;
  public types: VariableType[] = [
    this.variableType.DEFAULT,
    this.variableType.ALERT,
    this.variableType.MACHINE,
  ];

  public typeIndex: number = -1;
  public cardTypesStr: string[] = [
    'config.variable.types.default',
    'config.variable.types.alert',
    'config.variable.types.machine',
  ];

  public categories: string[];
  public devices: any[];

  public formatIndex: number = -1;
  public formats: string[] = [
    'config.variable.formats.int',
    'config.variable.formats.float',
    'config.variable.formats.bool',
  ];
  public codeFormat: string[] = ['int', 'float', 'bool'];

  public filteredCat: Observable<string[]>;

  constructor(
    private variablesService: VariablesService,
    private devicesService: DevicesService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<VariableFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  /**
   * Setup the metadata form with default value
   */
  private buildForm(): void {
    this.vId = this.data.vId ? this.data.vId : null;
    this.deviceId = this.data.deviceId ? this.data.deviceId : null;
    this.category = this.data.category ? this.data.category : null;
    this.type = this.data.type ? this.data.type : null;
    this.advice = this.data.advice ? this.data.advice : null;
    this.descr = this.data.descr ? this.data.descr : null;
    this.unit = this.data.unit ? this.data.unit : null;
    this.memorySlot = this.data.memorySlot ? this.data.memorySlot : null;
    this.location = this.data.location ? this.data.location : null;
    this.format = this.data.format ? this.data.format : null;
    this.enable = this.data.enable ? this.data.enable : false;
    this.isVisible = this.data.isVisible ? this.data.isVisible : false;

    this.variableForm = this.formBuilder.group({
      vId: [this.vId, [Validators.required]],
      deviceId: [this.deviceId, [Validators.required]],
      category: [this.category, [Validators.required]],
      type: [this.type ? `config.variable.types.${this.type}` : this.type, [Validators.required]],
      advice: [this.advice, []],
      descr: [this.descr, []],
      unit: [this.unit, [Validators.required]],
      memorySlot: [this.memorySlot, [Validators.required]],
      location: [this.location, []],
      format: [this.format ? `config.variable.formats.${this.format}` : this.format, [Validators.required]],
      enable: [this.enable, []],
      isVisible: [this.isVisible, []],
    });
  }

  ngOnInit() {
    this.fetchCategories();
    this.fetchDevices();
    this.buildForm();
  }

  /**
   * Add / Edit variable action
   */
  public onSubmit(): void {
    this.variableForm.value.type = this.type;
    this.variableForm.value.format = this.format;
    switch (this.data.mode) {
      case 'add':
        this.addVariable(this.variableForm.value);
        break;
      case 'edit':
        this.editVariable(this.variableForm.value);
        break;
      default:
        console.log('Wrong mode selected');
        break;
    }
  }

  /**
   * Fetch all Variable Categories
   */
  fetchCategories(): void {
    this.variablesService.getVariablesCategories().subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200 && res.data) {
          this.categories = res.data;
          this.filteredCat = this.variableForm.controls.category.valueChanges.pipe(
            startWith(''),
            map((value: string): any => this.filter(value))
          );
        }
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }

  /**
   * Fetch all Variable Categories
   */
  fetchDevices(): void {
    this.devicesService.getAll().subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200 && res.data) {
          this.devices = res.data.result;
        }
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }
  /**
   * Find value include in the filtered Categories
   * @param value - character to find in Array Categories
   * @return - Array string
   * @memberOf {VariableFormComponent}
   */
  filter(value: string): string[] {
    const filterValue: string = this.normalizeValue(value);
    return this.categories.filter((cat: string): any => this.normalizeValue(cat).includes(filterValue));
  }

  /**
   * Normalize value for replace whitespace
   * @param value - value to normalize
   * @return - String response
   * @memberOf {VariableFormComponent}
   */
  normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }


  /**
   * Output triggered when the type is selected
   *
   * @param event - event triggered
   * @memberOf {VariableFormComponent}
   */
  onTypeSelection(event: MatSelectChange): void {
    this.typeIndex = this.cardTypesStr.indexOf(event.value);

    this.type = this.types[this.typeIndex];
  }

  /**
   * Output triggered when the format is selected
   *
   * @param event - event triggered
   * @memberOf {VariableFormComponent}
   */
  onFormatSelection(event: MatSelectChange): void {
    this.formatIndex = this.formats.indexOf(event.value);

    this.format = this.codeFormat[this.formatIndex];
  }

  /**
   * Add a document
   * @param body - data to send for create variable
   */
  addVariable(body: any): void {
    this.variablesService.addVariable(body).subscribe(
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
   * @param body - data to send for edit current variable
   */
  editVariable(body: any): void {
    this.variablesService.editVariable(this.data._id, body).subscribe(
      (event: HttpEvent<any>) => {
        this.dialogRef.close(event);
      },
      (error: any) => {
        this.notificationService.error(error.error.message);
      }
    );
  }
}
