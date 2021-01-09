/**
 * Used to display the form to add or edit a counter only
 */
import { HttpEvent } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Variable } from 'src/models/api/variable.model';
import { CountersService } from 'src/syndicate/services/counters.service';
import { NotificationService } from 'src/syndicate/services/notification.service';
import { VariableSelectorComponent } from '../variable-selector/variable-selector.component';

@Component({
  templateUrl: './counter-form.component.html',
  styleUrls: ['./counter-form.component.scss'],
  providers: []
})
export class CounterFormComponent implements OnInit {

  public counterForm: FormGroup;
  public _id: string;
  public label: string;
  public description: string;
  public unit: string;
  public variable: Variable;
  public initOn: boolean;
  public toggle: any;

  public formats: string[] = ['day', 'hour', 'minute', 'all'];

  constructor(
    private countersService: CountersService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<CounterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  /**
   * Setup the metadata form with default value
   */
  private buildForm(): void {
    this._id = this.data._id ? this.data._id : null;
    this.initOn = this.data.initOn ? this.data.initOn : false;
    this.unit = this.data.unit ? this.data.unit : null;
    this.description = this.data.description ? this.data.description : null;
    this.label = this.data.label ? this.data.label : null;
    this.variable = this.data.variable ? this.data.variable : null;

    this.counterForm = this.formBuilder.group({
      label: [this.label, [Validators.required]],
      description: [this.description, [Validators.required]],
      unit: [this.unit, [Validators.required]],
      initOn: [this.initOn, []]
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Handler for add communication variable button
   * Opens VariableSelectorComponent in modal to chose one variable
   *
   * @memberOf {CounterFormComponent}
   */
  addVariable(): void {
    this.dialog.open(VariableSelectorComponent, {
      data: {
        multiple: false,
        entries: this.variable ? [this.variable] : [],
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: Variable[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.variable = new Variable().deserialize(result[0]);
      }
    });
  }


  /**
   * Handler to remove current communication variable
   *
   * @memberOf {CounterFormComponent}
   */
  removeVariable(): void {
    this.variable = null;
  }

  /**
   * Add / Edit counter action
   *
   * @memberOf {CounterFormComponent}
   */
  public onSubmit(): void {
    const body: any = {
      ...this.counterForm.value,
      vId: this.variable ? this.variable.vId : null,
    };

    if (this.variable.format !== 'bool') {
      delete body.initOn;
    }

    switch (this.data.mode) {
      case 'add':
        this.addCounter(body);
        break;
      case 'edit':
        this.editCounter(body);
        break;
      default:
        console.log('Wrong mode selected');
        break;
    }
  }

  /**
   * Add a counter
   * @param body - body to send
   * @memberOf {CounterFormComponent}
   */
  addCounter(body: any): void {
    this.countersService.addCounter(body).subscribe(
      (event: HttpEvent<any>) => {
        this.dialogRef.close(event);
      },
      (error: any) => {
        this.notificationService.error(error.error.message);
      }
    );
  }

  /**
   * Edit the current counter
   * @param body - body to send
   * @memberOf {CounterFormComponent}
   */
  editCounter(body: any): void {
    this.countersService.editCounter(this.data._id, body).subscribe(
      (event: HttpEvent<any>) => {
        this.dialogRef.close(event);
      },
      (error: any) => {
        this.notificationService.error(error.error.message);
      }
    );
  }
}
