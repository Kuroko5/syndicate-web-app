import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { LocalStorage, SessionStorage } from '../../../enums/storage';

@Component({
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VariableComponent implements OnInit {

  private storedVariables = [];

  public filter = {
    search: '',
    category: 'all'
  };
  public send = false;
  public options = [];
  public categories = [];
  public loading = false;
  public selectedVariables = [];
  public currentSearch = '';

  constructor(
    private variablesService: VariablesService,
    private storageService: SyndicateStorageService,
    public dialogRef: MatDialogRef<VariableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    const filter = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES_CATEGORY_SEARCH);
    if (filter) {
      this.filter.category = filter.category;
      this.filter.search = filter.search;
      this.currentSearch = filter.search;
    }
    this.options = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_CATEGORIES);
    this.storedVariables = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES);
    if (this.storedVariables) {
      this.selectedVariables = [...this.storedVariables];
    }
    this.getVariablesByCategories(this.filter);
  }

  /**
   * Get variables by categories
   * Apply a filter by searchBar and Categories
   */
  getVariablesByCategories(filter): void {
    this.loading = true;
    this.variablesService.getVariablesByCategories(filter).subscribe((variables) => {
      this.categories = variables.getChoiceVariables.result;
      this.loading = false;
    },                                                               (error) => {
      console.log(error);
      this.loading = false;
    });
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
   * Setup the statut of the checkbox for each variables
   * if the variable's id is saved then the statut of the checkbox is true
   * @param vId The id of the checked variable
   */
  isChecked(vId: string): boolean {
    let checked = false;

    if (this.storedVariables && this.storedVariables.length > 0) {
      this.storedVariables.forEach((variable) => {
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
    const variables = [...this.selectedVariables];

    if (this.containsObject(v, variables)) {
      variables.forEach((variable, index) => {
        if (variable.vId === v.vId) {
          variables.splice(index, 1);
        }
      });
    } else {
      variables.push(v);
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
    this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES_CATEGORY_SEARCH, this.filter);
    this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES, this.selectedVariables);
    const dates = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES_DATES);

    const currentDates = {
      min: '',
      max: ''
    };

    if (dates) {
      currentDates.min = dates.min;
      currentDates.max = dates.max;
    }

    this.send = true;
    this.variablesService.getVariablesHistorical(this.selectedVariables, currentDates).subscribe((historical) => {
      const data = historical.getRequiredVariables.data;
      this.send = false;
      this.dialogRef.close(data);
    },                                                                                           (error) => {
      console.log(error);
      this.send = false;
    });
  }
}
