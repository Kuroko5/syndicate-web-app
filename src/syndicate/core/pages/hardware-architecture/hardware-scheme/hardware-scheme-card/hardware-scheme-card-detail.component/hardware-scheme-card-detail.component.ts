import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Variable } from '../../../../../../../models/api/variable.model';

interface ICardDetailData {
  name: string;
  variables: Variable[];
}

@Component({
  selector: 'syndicate-hardware-detail',
  templateUrl: './hardware-scheme-card-detail.component.html',
  styleUrls: ['./hardware-scheme-card-detail.component.scss']
})
export class HardwareSchemeCardDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HardwareSchemeCardDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICardDetailData
  ) { }

  ngOnInit() { }

}
