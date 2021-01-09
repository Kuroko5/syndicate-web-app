import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Subscription, timer } from 'rxjs';
import { PositionComponent } from 'src/syndicate/components/modals/position/position.component';
import { environment } from '../../../../environments/environment';
import { Station } from '../../../../models/api/station.model';
import { StationService } from '../../../services/station.service';

@Component({
  selector: 'syndicate-hardware-architecture',
  templateUrl: './hardware-architecture.component.html',
  styleUrls: ['./hardware-architecture.component.scss']
})
export class HardwareArchitectureComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription = null;
  private deleteSubscription: Subscription = null;

  public pageName: string = '';
  public stations: Station[] = [];

  constructor(
    private i18nextService: I18NextService,
    private stationService: StationService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.hardware_architecture');
    this.startStationsTimer();
    this.stationService.getDeleteSubjectAsObs().subscribe((value: boolean) => {
      // if a delete was processed, restart the timer
      if (value) {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
        this.startStationsTimer();
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  /**
   * Retrieve all stations and start the timer
   *
   * @memberOf {HardwareArchitectureComponent}
   */
  startStationsTimer(): void {
    this.stationService.getAll().subscribe(
      (res: any): void => {
        this.stations = [];
        for (const station of res.data) {
          this.stations.push(new Station().deserialize(station));
        }
        this.getStationsWithTimer();
      }
    );
  }

  /**
   * Get the list of station every timer time
   *
   * @memberOf {HardwareArchitectureComponent}
   */
  getStationsWithTimer(): void {
    this.timerSubscription = timer(environment.timer).subscribe(
      () => this.stationService.getAll().subscribe(
        (res: any): void => {
          this.stations = [];
          for (const station of res.data) {
            this.stations.push(new Station().deserialize(station));
          }
          this.getStationsWithTimer();
        }
      ),
    );
  }

  /**
   * Open popup to change position of the stations
   *
   * @memberOf {HardwareArchitectureComponent}
   */
  changePosition(): void {
    this.dialog.open(PositionComponent, {
      data: {
        title: 'hardware_architecture.arrange.title',
        description: 'hardware_architecture.arrange.description',
        list: this.stations
      },
      width: '500px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe((stations: any) => {
      // reorder and reload stations
      if (stations) {
        this.stationService.updatePosition({ stations }).subscribe(
          (res: any) => {
            if (res.code === 200) {
              this.stationService.getAll().subscribe(
                (res: any): void => {
                  this.stations = [];
                  for (const station of res.data) {
                    this.stations.push(new Station().deserialize(station));
                  }
                }
              );
            }
          },
          (error: any) => {
            console.error(error);
          });
      }
    });
  }

  /*
   * Handler for add station button
   * Redirect to the creation form
   *
   * @memberOf {HardwareArchitectureComponent}
   */
  addStationClick(): void {
    this.router.navigate(['hardware-architecture', 'create']);
  }

}
