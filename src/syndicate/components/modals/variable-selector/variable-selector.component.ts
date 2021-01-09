import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { Variable } from '../../../../models/api/variable.model';
import { LocalStorage, SessionStorage } from '../../../enums/storage';

export interface IVariableSelectorInput {
  multiple: boolean;
  filter: any;
  entries: Variable[];
  format: string;
  type: string;
}

@Component({
  templateUrl: './variable-selector.component.html',
  styleUrls: ['./variable-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VariableSelectorComponent implements OnInit {

  public filter = {
    search: '',
    category: 'all',
    format: '',
    type: '',
  };
  public send = false;
  public options = [];
  public categories = [];
  public loading = false;
  public selectedVariables = [];
  public currentSearch = '';
  public multiple: boolean = true;

  constructor(
    private variablesService: VariablesService,
    private storageService: SyndicateStorageService,
    public dialogRef: MatDialogRef<VariableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVariableSelectorInput) {}

  ngOnInit() {
    if (this.data) {
      if (this.data.hasOwnProperty('multiple')) {
        this.multiple = this.data.multiple;
      }
      if (this.data.hasOwnProperty('entries')) {
        this.selectedVariables = [...this.data.entries];
      }
      if (this.data.hasOwnProperty('format')) {
        this.filter.format = this.data.format;
      }
      if (this.data.hasOwnProperty('type')) {
        this.filter.type = this.data.type;
      }
    }
    this.options = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_CATEGORIES);
    this.getVariablesByCategories(this.filter);
  }

  /**
   * Get variables by categories
   * Apply a filter by searchBar and Categories
   */
  getVariablesByCategories(filter): void {
    this.loading = true;
    this.variablesService.getVariablesByCategories(filter).subscribe(
      (variables) => {
        this.categories = variables.getChoiceVariables.result;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      },
    );
  }

  /**
   *
   * @param event The field value
   */
  onSend(event): void {
    this.filter.search = event.trim();
    this.getVariablesByCategories(this.filter);
  }

  /**
   * Refresh the list of variables with the selected category
   * @param event The selected category
   */
  onSelected(event: string): void {
    if (event !== this.filter.category) {
      this.categories.forEach((c) => {
        if (event !== c.category) {
          c.variables.forEach((v) => {
            if (this.selectedVariables.indexOf(v.vId) !== -1) {
              this.selectedVariables.splice(this.selectedVariables.indexOf(v.vId), 1);
            }
          });
        }
      });
    }
    this.filter.category = event;
    this.getVariablesByCategories(this.filter);
  }

  /**
   * Setup the status of the checkbox for each variables
   * if the variable's id is saved then the status of the checkbox is true
   * @param vId The id of the checked variable
   */
  isChecked(vId: string): boolean {
    let checked = false;

    if (this.selectedVariables && this.selectedVariables.length > 0) {
      this.selectedVariables.forEach((variable) => {
        if (variable.vId === vId) {
          checked = true;
        }
      });
      return checked;
    }
  }

  /**
   * Save the selected variable in a array or remove its if already exist
   * @param v The selected variable
   */
  onChange(v: any): void {
    let variables = [...this.selectedVariables];

    if (this.containsObject(v, variables)) {
      variables.forEach((variable, index) => {
        if (variable.vId === v.vId) {
          variables.splice(index, 1);
        }
      });
    } else {
      if (this.multiple) {
        variables.push(v);
      } else {
        variables = [v];
      }
    }
    this.selectedVariables = [...variables];
  }

  /**
   * Check if the object passed in param is in the list passed in param too
   * @param obj The object
   * @param list The array
   * @returns a boolean
   */
  containsObject(obj, list): boolean {
    return list.some(elem => elem.vId === obj.vId);
  }

  /**
   * Sort the selected variables in session storage
   * Sent the selected variables to display the graph
   */
  sendVariables(): void {
    this.dialogRef.close(this.selectedVariables);
  }
}
