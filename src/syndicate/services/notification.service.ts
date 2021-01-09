import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: []
  };

  private successClass: string = 'successSnackbar';
  private warningClass: string = 'warningSnackbar';
  private errorClass: string = 'errorSnackbar';

  constructor (
    private _snackBar: MatSnackBar
  ) {
  }

  /**
   * Show message with success style
   *
   * @param message - message to prompt to user
   * @memberOf {NotificationService}
   */
  success(message: string): void {
    this.config.panelClass = [this.successClass];
    this._snackBar.open(message, '', this.config);
  }

  /**
   * Show message with warning style
   *
   * @param message - message to prompt to user
   * @memberOf {NotificationService}
   */
  warning(message: string): void {
    this.config.panelClass = [this.warningClass];
    this._snackBar.open(message, '', this.config);
  }

  /**
   * Show message with error style
   *
   * @param message - message to prompt to user
   * @memberOf {NotificationService}
   */
  error(message: string): void {
    this.config.panelClass = [this.errorClass];
    this._snackBar.open(message, '', this.config);
  }
}
