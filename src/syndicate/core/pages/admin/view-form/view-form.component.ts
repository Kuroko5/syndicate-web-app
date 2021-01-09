import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable } from 'rxjs';
import { ICreateViewRequest } from '../../../../../models/interfaces/api/create-view.interface';
import { ConfirmComponent } from '../../../../components/modals/confirm/confirm.component';
import { CardType } from '../../../../enums/card-type.enum';
import { ViewsService } from '../../../../services/views.service';
import { ICardForm } from './view-card-form/view-card-form.component';

@Component({
  selector: 'syndicate-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.scss']
})
export class ViewFormComponent implements OnInit, AfterViewInit {

  private viewId: string = null;
  private stepperLength: number = 0;

  @ViewChild('stepper', { static: false }) matStepper: MatHorizontalStepper;

  public pageName: string;
  public viewForm: FormGroup;
  public currentStepIndex: number = 0;
  public name: string = '';
  // flag to know if the component is in update mode or not
  public update: boolean = false;

  public cardList: ICardForm[] = [{ label: '', type: '', variables: [] }];

  constructor(
    private i18nextService: I18NextService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private viewsService: ViewsService,
  ) {
  }

  /**
   * Utility method to build the form group used in the fist step
   *
   * @memberOf {ProfileFormComponent}
   */
  private buildForm(): void {
    this.viewForm = this.formBuilder.group({
      name: [this.name, Validators.required],
    });
  }

  /**
   * Helper method to know if a card is valid : has a name, a type and at least one variable
   * @param card - the card to check
   * @return true if valid, false otherwise
   * @memberOf {ViewFormComponent}
   */
  private cardValid(card: ICardForm): boolean {
    return card.label.trim().length > 0 && card.type.trim().length > 0 && card.variables.length > 0;
  }

  /**
   * Helper method to send the form to the API (for creation and update)
   *
   * @memberOf {ViewFormComponent}
   */
  private sendForm(): void {
    const request: ICreateViewRequest = {
      label: this.viewForm.controls.name.value,
      cards: [],
    };
    for (const card of this.cardList) {
      const variables: any[] = [];
      for (const variable of card.variables) {
        const v: any = {
          _id: (card.type === CardType.CONDITION ? variable.rule : variable.vId),
          description: variable.descr,
        };
        variables.push(v);
      }
      request.cards.push({ variables, label: card.label, type: card.type });
    }
    let apiCall: Observable<any>;
    if (this.update) {
      apiCall = this.viewsService.updateView(this.viewId, request);
    } else {
      apiCall = this.viewsService.createView(request);
    }
    apiCall.subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200) {
          this.router.navigate(['/admin', { index: 2 }]);
        } else {
          console.error(res.message);
        }
      }
    );
  }


  ngOnInit() {
    this.pageName = this.i18nextService.t('admin.view.title.new');
    if (this.route.params) {
      this.route.params.subscribe((value: Params): void => {
        if (value.hasOwnProperty('view')) {
          const view: any = JSON.parse(value.view);
          this.pageName = this.i18nextService.t('admin.view.title.update');
          this.update = true;
          this.viewId = view._id;
          this.name = view.label;
          this.cardList = view.cards.map(
            (card: any) => {
              // transform _id into vId and description into descr
              const variables = card.variables.map(
                (variable: any) => {
                  return { vId: variable._id, descr: variable.description };
                },
              );
              return { variables, label: card.label, type: card.type };
            },
          );
        }
      });
    }
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.stepperLength = this.matStepper.steps.length;
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
    } else {
      this.cancelForm();
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
      this.sendForm();
    }
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
        this.router.navigate(['/admin', { index: 2 }]);
      }
    });
  }

  /**
   * Add a new empty card to the list
   *
   * @memberOf {ViewFormComponent}
   */
  addViewCard(): void {
    const card: ICardForm = { label: '', type: '', variables: [] };
    this.cardList.push(card);
  }

  /**
   * Output triggered when a card is changed, update the corresponding card in the list
   *
   * @param card - new card with changes
   * @param index - index of the changed card
   * @memberOf {ViewFormComponent}
   */
  onCardChange(card: any, index: number): void {
    Object.assign(this.cardList[index], card);
  }

  /**
   * Remove a card form the list at the given index
   *
   * @param index - position to remove the card to
   * @memberOf {ViewFormComponent}
   */
  removeCard(index: number): void {
    this.cardList.splice(index, 1);
  }

  /**
   * Move the drag item in drop position
   *
   * @param event - Drag and drop event
   * @memberOf {PositionComponent}
   */
  dragDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cardList, event.previousIndex, event.currentIndex);
  }

  /**
   * Helper method to know if the next button is visible or not depending on the current step
   *
   * @return true if visible, false otherwise
   * @memberOf {ViewFormComponent}
   */
  nextButtonVisible(): boolean {
    switch (this.currentStepIndex) {
      case 0:
        return this.viewForm.valid;
      case 1:
      case 2:
        return (this.update || this.cardList.length > 0) && this.cardList.every(this.cardValid);
      default:
        return true;
    }
  }
}
