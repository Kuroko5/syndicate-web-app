/**
 * Component used to display the description of the selected item in the datatable
 * Used to display the variable's detail or the report's detail only
 */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/**
 * Interface used for data input typing
 */
interface IDescriptionData {
  name?: string;
  type?: string;
  createdAt?: string;
  activated?: boolean;
  variable: any;
  config?: boolean;
  operator?: any;
  description?: any;
}

@Component({
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  config: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDescriptionData,
  ) {
    this.config = data.config;
  }

  ngOnInit() {
  }
}
