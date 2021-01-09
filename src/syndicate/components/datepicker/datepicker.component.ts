import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { DateRange } from '../../../models/interfaces/dateRange';

@Component({
  selector: 'syndicate-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  public dateTime: Date[];

  @Input() set currentDates(dates) {
    if (dates) {
      const min = new Date(dates.min);
      const max = new Date(dates.max);

      this.dateTime = [min, max];
    }
  }

  @Output() selectedDate: EventEmitter<DateRange> = new EventEmitter<DateRange>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Event how detect if the user has seleted a date range
   * @param event Selection of date event
   */
  dateTimeChange(event): void {
    if (event.value.length <= 0) {
      return;
    }

    const range = {
      min: '',
      max: ''
    };

    if (event.value[0]) range.min = moment(event.value[0]).format();

    if (event.value[1]) range.max = moment(event.value[1]).format();

    this.selectedDate.emit(range);
  }

  /**
   * Clear the selected date range
   * Then reset the date filter
   */
  clearValue(event: Event): void {
    event.stopPropagation();

    this.dateTime = undefined;

    this.selectedDate.emit({
      min: '',
      max: ''
    });
  }
}
