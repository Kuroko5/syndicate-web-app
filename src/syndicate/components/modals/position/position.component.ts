import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'syndicate-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  public title: string = '';
  public description: string = '';
  public list: any[];

  constructor(
    public dialogRef: MatDialogRef<PositionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    this.description = this.data.description;
    this.list = this.data.list;
  }

  /**
   * Submit request to change position of stations
   *
   * @memberOf {PositionComponent}
   */
  public submit(): void {
    const list: any[] = [];
    for (const element of this.list) {
      list.push(element._id);
    }
    // Close the modal and send the reordered array
    this.dialogRef.close(list);
  }

  /**
   * Move the drag item in drop position
   *
   * @param event - Drag and drop event
   * @memberOf {PositionComponent}
   */
  dragDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  /**
   * Move a item to a lower index
   *
   * @param index - index of the item
   * @memberOf {PositionComponent}
   */
  up(index: number): void {
    moveItemInArray(this.list, index, index - 1);
  }

  /**
   * Move a item to a upper index
   *
   * @param index - index of the item
   * @memberOf {PositionComponent}
   */
  down(index: number): void {
    moveItemInArray(this.list, index, index + 1);
  }
}
