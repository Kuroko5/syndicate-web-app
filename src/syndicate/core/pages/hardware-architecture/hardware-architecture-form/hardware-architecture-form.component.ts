import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable } from 'rxjs';
import { Variable } from '../../../../../models/api/variable.model';
import { ConfirmComponent } from '../../../../components/modals/confirm/confirm.component';
import { VariableSelectorComponent } from '../../../../components/modals/variable-selector/variable-selector.component';
import { StationService } from '../../../../services/station.service';

@Component({
  selector: 'syndicate-hardware-architecture-form',
  templateUrl: './hardware-architecture-form.component.html',
  styleUrls: ['./hardware-architecture-form.component.scss']
})
export class HardwareArchitectureFormComponent implements OnInit, AfterViewInit {

  private stationId: string = null;
  private stepperLength: number = 0;

  @ViewChild('stepper', { static: false }) matStepper: MatHorizontalStepper;

  public pageName: string;
  public currentStepIndex: number = 0;
  public stationForm: FormGroup;
  public ipAddress: string = '';
  public label: string = '';
  public communicationVariable: Variable = null;
  public hardwareVariable: Variable = null;
  public equipmentsVariables: Variable[] = null;
  // flag to know if the component is in update mode or not
  public update: boolean = false;


  /**
   * Returns a FormArray with the name 'formArray'
   *
   * @return - FormArray control
   * @memberOf {HardwareArchitectureFormComponent}
   */
  get formArray(): AbstractControl | null {
    return this.stationForm.get('formArray');
  }

  constructor(
    private i18nextService: I18NextService,
    private formBuilder: FormBuilder,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.hardware_architecture_form');
    if (this.route.params) {
      this.route.params.subscribe((value: Params) => {
        if (value.hasOwnProperty('id')) {
          this.stationId = value.id;
          this.update = true;
        }
        if (value.hasOwnProperty('ip') && value.hasOwnProperty('name')) {
          this.ipAddress = value.ip;
          this.label = value.name;
          this.update = true;
        }
        if (value.hasOwnProperty('vComm') && JSON.parse(value.vComm) !== null) {
          this.communicationVariable = new Variable().deserialize(JSON.parse(value.vComm));
        }
        if (value.hasOwnProperty('vMachine') && JSON.parse(value.vMachine) !== null) {
          this.hardwareVariable = new Variable().deserialize(JSON.parse(value.vMachine));
        }
        if (value.hasOwnProperty('variables')) {
          this.equipmentsVariables = [];
          const variables: any[] = JSON.parse(value.variables);
          for (const variable of variables) {
            this.equipmentsVariables.push(new Variable().deserialize(variable));
          }
        }
        this.buildForm();
      });
    }
  }

  ngAfterViewInit(): void {
    this.stepperLength = this.matStepper.steps.length;
  }

  /**
   * Utility method to build the form group used in the fist step
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  buildForm(): void {
    this.stationForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          label: [this.label, Validators.required],
          ip: [this.ipAddress, Validators.required],
        }),
      ])
    });
  }

  /**
   * Update current step with new value on each step change
   *
   * @param event - event emitted when step is changed
   * @memberOf {HardwareArchitectureFormComponent}
   */
  onStepChange(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
  }

  /**
   * Handler for previous step button
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  previousStepClick(): void {
    if (this.currentStepIndex > 0) {
      this.matStepper.previous();
    }
  }

  /**
   * Handler for next step button
   * If step is last then create or update the station
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  nextStepClick(): void {
    if (this.currentStepIndex < (this.stepperLength - 1)) {
      this.matStepper.next();
    } else if (this.currentStepIndex === (this.stepperLength - 1)) {
      this.createOrUpdateStation();
    }
  }

  /**
   * Create or update the current station
   * Call api depending on update flag value
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  createOrUpdateStation(): void {
    let body: any = {};
    for (const entry of this.formArray.value) {
      body = { ...body, ...entry };
    }
    if (this.communicationVariable) {
      body['vComm'] = this.communicationVariable;
    }
    if (this.hardwareVariable) {
      body['vMachine'] = this.hardwareVariable;
    }
    if (this.equipmentsVariables && this.equipmentsVariables.length > 0) {
      body['variables'] = this.equipmentsVariables;
    }
    let apiCall: Observable<any> = this.stationService.createOne(body);
    if (this.update && this.stationId) {
      apiCall = this.stationService.updateOne(this.stationId, body);
    }
    apiCall.subscribe(
      (res: any): void => {
        // if success (update or creation OK)
        if (res.code === 200 || res.code === 201) {
          this.router.navigate(['hardware-architecture']);
        } else {
          console.error(res.message);
        }
      },
      (error) => {
        console.error(error.error.message);
      }
    );
  }

  /**
   * Handler for add communication variable button
   * Opens VariableSelectorComponent in modal to chose one variable
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  addCommunicationVariable(): void {
    this.dialog.open(VariableSelectorComponent, {
      data: {
        multiple: false,
        entries: this.communicationVariable ? [this.communicationVariable] : [],
        format: 'bool'
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: Variable[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.communicationVariable = new Variable().deserialize(result[0]);
      }
    });
  }

  /**
   * Handler for add hardware variable button
   * Opens VariableSelectorComponent in modal to chose one variable
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  addHardwareVariable(): void {
    this.dialog.open(VariableSelectorComponent, {
      data: {
        multiple: false,
        entries: this.hardwareVariable ? [this.hardwareVariable] : [],
        format: 'bool'
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: Variable[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.hardwareVariable = new Variable().deserialize(result[0]);
      }
    });
  }

  /**
   * Handler for add equipments variables button
   * Opens VariableSelectorComponent in modal to chose multiple variables
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  addEquipmentsVariable(): void {
    this.dialog.open(VariableSelectorComponent, {
      data: {
        multiple: true,
        entries: this.equipmentsVariables ? this.equipmentsVariables : [],
        format: 'bool'
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: Variable[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.equipmentsVariables = [];
        for (const variable of result) {
          this.equipmentsVariables.push(new Variable().deserialize(variable));
        }
      }
    });
  }

  /**
   * Handler to remove current communication variable
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  removeCommunicationVariable(): void {
    this.communicationVariable = null;
  }

  /**
   * Handler to remove current hardware variable
   * @memberOf {HardwareArchitectureFormComponent}
   */
  removeHardwareVariable(): void {
    this.hardwareVariable = null;
  }

  /**
   * Handler to remove one equipment variable from the list
   *
   * @param vId - vId of the variable to be removed
   * @memberOf {HardwareArchitectureFormComponent}
   */
  removeEquipmentsVariable(vId: string): void {
    this.equipmentsVariables.forEach((variable: Variable, index: number): void => {
      if (variable.vId === vId) {
        this.equipmentsVariables.splice(index, 1);
      }
    });
  }

  /**
   * Handler for cancel button
   * Opens ConfirmComponent in modal and navigate back to the scheme upon user's validation
   *
   * @memberOf {HardwareArchitectureFormComponent}
   */
  cancelForm(): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('hardware_architecture.add_station.cancel_message')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(['/hardware-architecture']);
      }
    });
  }
}
