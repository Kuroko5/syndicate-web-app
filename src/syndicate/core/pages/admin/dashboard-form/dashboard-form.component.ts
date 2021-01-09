import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable } from 'rxjs';
import { View } from 'src/models/api/view.model';
import { CardsService } from 'src/syndicate/services/cards.service';
import { NotificationService } from 'src/syndicate/services/notification.service';
import { ViewsService } from 'src/syndicate/services/views.service';
import { ConfirmComponent } from '../../../../components/modals/confirm/confirm.component';
import { VariableSelectorComponent } from '../../../../components/modals/variable-selector/variable-selector.component';
import { CardType } from '../../../../enums/card-type.enum';


export interface IVariableDashboardCard {
  vId: string;
  descr: string;
  value: any;
  label: string;
  format: string;
  values: any[];
}
@Component({
  selector: 'syndicate-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss']
})
export class DashboardFormComponent implements OnInit, AfterViewInit {

  private id: string;

  private addVariableStr: string = 'admin.dashboard.card.add_variables';
  private addConditionStr: string = 'admin.dashboard.card.add_conditions';
  private selectedViews: View[] = [];
  private stepperLength: number = 0;

  @ViewChild('stepper', { static: false }) matStepper: MatHorizontalStepper;

  public cardType: typeof CardType = CardType;
  public types: CardType[] = [
    this.cardType.DEFAULT,
    this.cardType.ALERT,
    this.cardType.MACHINE,
    this.cardType.CONDITION,
    this.cardType.EQUIPMENT,
    this.cardType.REPORT
  ];

  public currentStepIndex: number = 0;

  public typeIndex: number = -1;
  public cardTypesStr: string[] = [
    'admin.cards.types.default',
    'admin.cards.types.alert',
    'admin.cards.types.machine',
    'admin.cards.types.condition',
    'admin.cards.types.equipment',
    'admin.cards.types.report'
  ];

  public addStr: string = this.addVariableStr;
  public allViews: any[];

  public pageName: string;
  public update: boolean = false;
  public type: string;
  public label: string;
  public column: boolean = false;
  public dashboardCardForm: FormGroup;
  public equipmentsVariables: IVariableDashboardCard[] = [];
  public colorScheme: any = {
    domain: [
      '#004289',
      '#087F5B',
      '#862E9C',
      '#A61E4D',
      '#D9480F',
      '#364FC7',
      '#3BCF33',
      '#5F3DC4',
      '#C41037',
      '#FF922B',
      '#22B8CF',
      '#94D82D',
      '#B533CF',
      '#FA5252',
      '#CFB133',
      '#4DABF7',
      '#63E6BE',
      '#CC5DE8',
      '#F06595',
      '#FFD43B',
      '#99E9F2',
      '#0B7285',
      '#845EF7',
      '#FFA8A8',
      '#FFC078'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nextService: I18NextService,
    private dialog: MatDialog,
    private viewsService: ViewsService,
    private cardsService: CardsService,
    private notificationService: NotificationService
  ) { }

  /**
   * Utility method to build the form group used in the fist step
   *
   * @memberOf {DashboardFormComponent}
   */
  private buildForm(): void {
    this.dashboardCardForm = this.formBuilder.group({
      label: [this.label, Validators.required],
      column: [this.column],
    });
  }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.dashboard_form');

    this.route.params.subscribe((params: Params): void => {
      if (params.hasOwnProperty('card')) {
        this.update = true;
        const currentCard: any = JSON.parse(params.card);
        this.id = currentCard._id;
        this.type = currentCard.type;
        this.label = currentCard.label;
        this.column = currentCard.column === 2 ? true : false;
        if (currentCard.variables) {
          this.equipmentsVariables = currentCard.variables;
        }
        if (currentCard.views) {
          this.selectedViews = currentCard.views;
        }
      }
    });

    this.buildForm();
  }

  /**
   * Handler for view's checkbox change output
   *
   * @param event - event emitted
   * @param index - index of view to (un)check
   * @memberOf {DashboardFormComponent}
   */
  onViewChecked(event: MatCheckboxChange, index: number): void {
    this.allViews[index].checked = event.checked;
  }

  ngAfterViewInit() {
    this.viewsService.getAll().subscribe(
      (result: any): void => {
        if (result.data && result.data.result) {
          this.allViews = [];
          for (const view of result.data.result) {
            const obj: any = new View().deserialize(view);
            obj.checked = this.selectedViews.some((view: View): boolean => view._id === obj._id);
            this.allViews.push(obj);
          }
        }
      }
    );
  }

  /**
   * Output triggered when the type is selected
   *
   * @param event - event triggered
   * @memberOf {DashboardFormComponent}
   */
  onTypeSelection(event: MatSelectChange): void {
    this.typeIndex = this.cardTypesStr.indexOf(event.value);

    if (this.typeIndex < 3) {
      this.addStr = this.addVariableStr;
    } else {
      this.addStr = this.addConditionStr;
    }

    this.type = this.types[this.typeIndex];
  }

  /**
   * Handler for cancel button
   * Opens ConfirmComponent in modal and navigate back to the administration's user tab upon user's validation
   *
   * @memberOf {DashboardFormComponent}
   */
  onCancel(): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('global.action.cancel')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().subscribe((res: boolean): void => {
      if (res) {
        // redirect to admin page on profile tab (tab index 1)
        this.router.navigate(['/admin']);
      }
    });
  }

  /**
   * Update current step with new value on each step change
   *
   * @param event - event emitted when step is changed
   * @memberOf {DashboardFormComponent}
   */
  onStepChange(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
  }

  /**
   * Handler for next step button
   * If step is last then create or update the station
   *
   * @memberOf {DashboardFormComponent}
   */
  nextStepClick(): void {
    this.stepperLength = this.matStepper.steps.length;
    if (this.currentStepIndex < (this.stepperLength - 1)) {
      this.matStepper.next();
    } else if (this.currentStepIndex === (this.stepperLength - 1)) {
      this.onSubmit();
    }
  }

  /**
   * click on submit button
   * POST new card or PUT current card depending on update flag
   *
   * @memberOf {DashboardFormComponent}
   */
  onSubmit(): void {
    const body: any = {
      // All property for body
      type: this.type,
      label: this.dashboardCardForm.controls.label.value,
      column: this.dashboardCardForm.controls.column && this.dashboardCardForm.controls.column.value === true ? 2 : 1,
    };

    if (body.type === this.cardType.EQUIPMENT) {
      body.views = [];
      for (const view of this.allViews) {
        if (view.checked) {
          body.views.push(String(view._id));
        }
      }
    }

    if (body.type === this.cardType.MACHINE) {
      if (this.equipmentsVariables && this.equipmentsVariables.length > 0) {
        body.variables = this.equipmentsVariables;
      }
    }

    if (body.type === this.cardType.CONDITION) {
      body.column = 2;
    }

    let apiCall: Observable<any>;
    if (this.update) {
      apiCall = this.cardsService.edit(this.id, body);
    } else {
      apiCall = this.cardsService.create(body);
    }
    apiCall.subscribe(
      (res: any) => {
        if (res && res.code === 200) {
          this.router.navigate(['/admin', { index: 3 }]);
        } else {
          this.notificationService.error(res.message);
        }
      },
      (error: any): void => {
        this.notificationService.error(error.error.message);
      }
    );
  }

  /**
   * Handler for add equipments variables button
   * Opens VariableSelectorComponent in modal to chose multiple variables
   *
   * @memberOf {DashboardFormComponent}
   */
  addEquipmentsVariable(): void {
    this.dialog.open(VariableSelectorComponent, {
      data: {
        multiple: true,
        entries: this.equipmentsVariables ? this.equipmentsVariables : [],
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: IVariableDashboardCard[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.equipmentsVariables = this.equipmentsVariables.length ? this.equipmentsVariables : [];
        for (const variable of result) {
          if (!this.equipmentsVariables.find((v: any) => String(v.vId) === String(variable.vId))) {
            if (variable.format === 'bool') {
              variable.values = [
                { label: '', value: false, color: '' },
                { label: '', value: false, color: '' },
              ];
            }
            variable.label = '';
            this.equipmentsVariables.push(variable);
          }
        }
      }
    });
  }

  /**
   * Set new name for the variable
   * @param event - Value of the new name for the variable
   * @param variable - Variable to set new name
   */
  onNameChange(event: any, variable: any) {
    if (event.target.value) {
      variable.label = event.target.value;
    }
  }

  /**
   * Set label and value for the current variable
   * @param event - Label of the value to set in the current variable
   * @param variable - variable to set value
   * @param index - index of the variable
   */
  onChange(event: any, variable: any, index: number) {
    let bool: boolean = false;

    if (variable.format === 'bool') {
      if (!variable.values) {
        variable.values = [];
      }

      if (index === 1) {
        bool = true;
      }

      variable.values[index]['label'] = event.target.value;
      variable.values[index]['value'] = bool;
    }
  }

  /**
   * Set or update color of the variable
   *
   * @param event - Color selected
   * @param variable - Variable to change colo
   * @param index - Index to which the item should be moved.
   */
  onChangeColor(event: string, variable: any, index: number) {
    variable.values[index].color = event;
    this.equipmentsVariables.find((v: any) => variable.vId === v.vId ? variable : v);

  }

  /**
   * Handler to remove one equipment variable from the list
   *
   * @param vId - vId of the variable to be removed
   * @memberOf {DashboardFormComponent}
   */
  removeEquipmentsVariable(vId: string): void {
    this.equipmentsVariables.forEach((variable: IVariableDashboardCard, index: number): void => {
      if (variable.vId === vId) {
        this.equipmentsVariables.splice(index, 1);
      }
    });
  }

  /**
   * Move the drag item in drop position
   *
   * @param event - Drag and drop event
   * @memberOf {PositionComponent}
   */
  dragDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.equipmentsVariables, event.previousIndex, event.currentIndex);
  }

  /**
   * Move a item to a lower index
   *
   * @param index - index of the item
   * @memberOf {DashboardFormComponent}
   */
  up(index: number): void {
    moveItemInArray(this.equipmentsVariables, index, index - 1);
  }

  /**
   * Move a item to a upper index
   *
   * @param index - index of the item
   * @memberOf {DashboardFormComponent}
   */
  down(index: number): void {
    moveItemInArray(this.equipmentsVariables, index, index + 1);
  }
}
