import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'syndicate-profile-description',
  templateUrl: './profile-description.component.html',
  styleUrls: ['./profile-description.component.scss']
})
export class ProfileDescriptionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProfileDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

}
