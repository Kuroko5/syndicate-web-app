import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VariablesService } from 'src/syndicate/services/variables.service';

@Component({
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  public edit = false;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variablesService: VariablesService) {}

  ngOnInit() {
  }

  /**
   * Set variable to show HTML edit block
   */
  adviceEditor(): void {
    this.edit = true;
  }

  /**
   * Set variable to show HTML edit block
   */
  cancel(): void {
    this.edit = false;
  }

  /**
   * Edit the advice
   */
  editAdvice(event, row): void {
    const data = {
      advice: event.target.advice.value
    };
    this.variablesService.editAdvice(row.vId, data).subscribe(
      (res) => {
        if (res) {
          row.advice = data.advice;
          this.edit = false;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
