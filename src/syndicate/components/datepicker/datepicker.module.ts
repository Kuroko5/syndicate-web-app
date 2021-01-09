import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18NextModule, I18NextService } from 'angular-i18next';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeIntl,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { DatepickerComponent } from './datepicker.component';

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
};

export class DefaultIntl extends OwlDateTimeIntl {

  /** A label for the cancel button */
  public cancelBtnLabel = this.i18NextService.t('global.close');
  /** A label for the set button */
  public setBtnLabel = this.i18NextService.t('global.set');
  /** A label for the range 'from' in picker info */
  public rangeFromLabel = this.i18NextService.t('global.from');
  /** A label for the range 'to' in picker info */
  public rangeToLabel = this.i18NextService.t('global.to');

  constructor(private i18NextService: I18NextService) {
    super();
  }
}

@NgModule({
  declarations: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    I18NextModule.forRoot()
  ],
  exports: [DatepickerComponent],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
  ]
})
export class DatepickerModule { }
