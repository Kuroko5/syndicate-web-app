import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ConditionSelectorComponent } from '../../../../../components/modals/condition-selector/condition-selector.component';
import { VariableSelectorComponent } from '../../../../../components/modals/variable-selector/variable-selector.component';
import { CardType } from '../../../../../enums/card-type.enum';

export interface ICardForm {
  label: string;
  type: string;
  variables: any[];
}
@Component({
  selector: 'syndicate-view-card-form',
  templateUrl: './view-card-form.component.html',
  styleUrls: ['./view-card-form.component.scss']
})
export class ViewCardFormComponent implements OnInit {

  private _card: ICardForm;

  private types: string[] = [
    CardType.DEFAULT,
    CardType.ALERT,
    CardType.MACHINE,
    CardType.CONDITION
  ];
  private addVariableStr: string = 'admin.view.cards.add_variables';
  private addConditionStr: string = 'admin.view.cards.add_conditions';

  /**
   * Emit a change every time the card is changed
   *
   * @memberOf {ViewCardFormComponent}
   */
  @Output() cardChange: EventEmitter<any> = new EventEmitter<any>();

  @Input('card')
  set card(value: any) {
    this._card = value;
    this.choices = this._card.variables;
  }

  get card(): any {
    return this._card;
  }

  public typeIndex: number = -1;
  public cardTypesStr: string[] = [
    'admin.cards.types.default',
    'admin.cards.types.alert',
    'admin.cards.types.machine',
    'admin.cards.types.condition'
  ];
  public addStr: string = this.addVariableStr;
  public choices: any[] = [];

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  /**
   * Output triggered when the name is changed in the form
   *
   * @param event - event triggered
   * @memberOf {ViewCardFormComponent}
   */
  onNameChange(event: any): void {
    this.card.label = event.target.value;
    this.cardChange.emit(this.card);
  }

  /**
   * Output triggered when the type is selected
   *
   * @param event - event triggered
   * @memberOf {ViewCardFormComponent}
   */
  onTypeSelection(event: MatSelectChange): void {
    this.typeIndex = this.cardTypesStr.indexOf(event.value);
    if (this.typeIndex < 3) {
      this.addStr = this.addVariableStr;
    } else {
      this.addStr = this.addConditionStr;
    }
    this.card.type = this.types[this.typeIndex];
    this.card.variables = [];
    this.choices = [];
    this.cardChange.emit(this.card);
  }

  /**
   * Method to open the variable selection dialog and select variables depending on the type
   *
   * @memberOf {ViewCardFormComponent}
   */
  addVariables(): void {
    let ref: any = VariableSelectorComponent;
    if (this.typeIndex === 3) {
      ref = ConditionSelectorComponent;
    }
    this.dialog.open(ref, {
      data: {
        type: this.card.type,
        multiple: true,
        entries: this.choices,
      },
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: any[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.card.variables = result;
        this.choices = result;
        this.cardChange.emit(this.card);
      }
    });
  }

  /**
   * Move a item to a lower index
   *
   * @param index - index of the item
   * @memberOf {ViewCardFormComponent}
   */
  up(index: number): void {
    moveItemInArray(this.choices, index, index - 1);
    this.card.variables = this.choices;
    this.cardChange.emit(this.card);
  }

  /**
   * Move a item to a upper index
   *
   * @param index - index of the item
   * @memberOf {ViewCardFormComponent}
   */
  down(index: number): void {
    moveItemInArray(this.choices, index, index + 1);
    this.card.variables = this.choices;
    this.cardChange.emit(this.card);
  }

  /**
   * Remove a variable from the list
   *
   * @param index - position to remove the variable at
   * @memberOf {ViewCardFormComponent}
   */
  remove(index: number): void {
    this.choices.splice(index, 1);
    this.card.variables = this.choices;
    this.cardChange.emit(this.card);
  }
}
