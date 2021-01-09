import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { I18NextService } from 'angular-i18next';
import { Subscription, timer } from 'rxjs';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { DegradedModeService } from 'src/syndicate/services/degradedMode.service';

import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './degradedMode.component.html',
  styleUrls: ['./degradedMode.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DegradedModeComponent implements OnInit, OnDestroy {

  // Defaults Subscription and timer
  private degradedModeSusbcription: Subscription;
  private degradedModeTimerSubscription: Subscription;

  public pageName = '';
  public degradedModes = [];
  public openedPanel = '';

  constructor(
    private i18nextService: I18NextService,
    private degradedModeService: DegradedModeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.degraded');

    this.initDegradedModes();
  }

  /**
   * Initialize the list of modes/skills
   */
  public initDegradedModes(): void {
    this.degradedModeSusbcription = this.degradedModeService.getDegradedModes().subscribe((modes) => {
      if (modes) {
        this.degradedModes = modes.skills;

        this.refreshDegradedmode();
      }
    },                                                                                    (error) => {
      console.log(error);
    });
  }

  /**
   * Refresh the list of degraded mode
   */
  public refreshDegradedmode(): void {
    this.degradedModeTimerSubscription = timer(environment.timer).subscribe(() => this.initDegradedModes());
  }

  /**
   * Let open the panel if is already open
   * @param modeId The mode Id
   */
  isOpened(modeId): void {
    this.openedPanel = modeId;
  }

  /**
   * Close event on the selected panel.
   * reset the value of openedPanel variable
   * @param modeId The mode id
   */
  isClosed(modeId): void {
    if (this.openedPanel === modeId) {
      this.openedPanel = '';
    }
  }

  /**
   * Start a selected mode/skill
   * Reset the list of mode/skill when successed
   * @param modeId The mode/skill id
   */
  public startDegradedMode(modeId): void {
    this.degradedModeService.startDegradedMode(modeId).subscribe((res) => {
      if (res.data.message !== 'failed') {
        this.initDegradedModes();
      }
    },                                                           (error) => {
      console.log(error);
    });
  }

  /**
   * Stop a selected mode/skill
   * Reset the list of mode/skill when successed
   * @param modeId The mode/skill id
   */
  public stopDegradedMode(modeId): void {
    this.degradedModeService.stopDegradedMode(modeId).subscribe((res) => {
      if (res.data.message !== 'failed') {
        this.initDegradedModes();
      }
    });
  }

  /**
   * Start the selected mode/skill
   * @param modeId The mode/skill id
   */
  public onStartMode(modeId: string): void {
    this.displayConfirmModal(modeId, true);
  }

  /**
   * Stop the selected mode/skill
   * @param modeId The mode/skill id
   */
  public stopMode(event: Event, modeId: string): void {
    event.stopPropagation();
    this.displayConfirmModal(modeId, false);
  }

  /**
   * Open the confirm modal to start the mode
   * @param modeId The id of the selected mode/skill
   */
  public displayConfirmModal(modeId, important): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        important,
        message: this.i18nextService.t('degradedMode.stopActionConfirm')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (important) {
          this.startDegradedMode(modeId);
        } else {
          this.stopDegradedMode(modeId);
        }
      }
    },                                (error) => {
      console.log(error);
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.degradedModeSusbcription) {
      this.degradedModeSusbcription.unsubscribe();
    }
    if (this.degradedModeTimerSubscription) {
      this.degradedModeTimerSubscription.unsubscribe();
    }
  }
}
