import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConditionsService } from '../../../services/conditions.service';

export interface IConditionSelectorInput {
  multiple: boolean;
  entries: any[];
}

@Component({
  templateUrl: './condition-selector.component.html',
  styleUrls: ['./condition-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConditionSelectorComponent implements OnInit {

  public conditions: any = [];
  public send: boolean = false;
  public options: any[] = [];
  public loading: boolean = false;
  public selectedConditions: any[] = [];
  public multiple: boolean = true;

  constructor(
    private conditionsService: ConditionsService,
    public dialogRef: MatDialogRef<ConditionSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConditionSelectorInput) {}

  ngOnInit() {
    if (this.data) {
      if (this.data.hasOwnProperty('multiple')) {
        this.multiple = this.data.multiple;
      }
      if (this.data.hasOwnProperty('entries')) {
        this.selectedConditions = [...this.data.entries];
      }
    }
    this.getConditions();
  }

  getConditions(): void {
    this.loading = true;
    this.conditionsService.getConditions().subscribe(
      (conditions: any): void => {
        this.loading = false;
        this.conditions = conditions.data;
      },
      (error: any): void => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * Setup the status of the checkbox for each variables
   * if the variable's id is saved then the status of the checkbox is true
   * @param rule - The id of the checked variable
   */
  isChecked(rule: string): boolean {
    let checked: boolean = false;

    if (this.selectedConditions && this.selectedConditions.length > 0) {
      this.selectedConditions.forEach((condition: any): void => {
        if (condition.rule === rule) {
          checked = true;
        }
      });
      return checked;
    }
  }

  /**
   * Save the selected condition in a array or remove it if already exists
   * @param c The selected condition
   */
  onChange(c: any): void {
    let conditions: any[] = [...this.selectedConditions];

    if (this.containsObject(c, conditions)) {
      conditions.forEach((condition: any, index: number): void => {
        if (condition.rule === c.rule) {
          conditions.splice(index, 1);
        }
      });
    } else {
      if (this.multiple) {
        conditions.push(c);
      } else {
        conditions = [c];
      }
    }
    this.selectedConditions = [...conditions];
  }

  /**
   * Check if the object passed in param is in the list passed in param too
   * @param obj The object
   * @param list The array
   * @returns a boolean
   */
  containsObject(obj: any, list: any[]): boolean {
    return list.some((elem: any): boolean => elem.rule === obj.rule);
  }

  /**
   * Sort the selected variables in session storage
   * Sent the selected variables to display the graph
   */
  sendVariables(): void {
    this.dialogRef.close(this.selectedConditions);
  }
}
