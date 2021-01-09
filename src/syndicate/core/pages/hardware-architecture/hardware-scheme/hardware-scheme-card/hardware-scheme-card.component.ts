import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { PingComponent } from 'src/syndicate/components/modals/ping/ping.component';
import { Station } from '../../../../../../models/api/station.model';
import { Variable } from '../../../../../../models/api/variable.model';
import { StationService } from '../../../../../services/station.service';
import { HardwareSchemeCardDetailComponent } from './hardware-scheme-card-detail.component/hardware-scheme-card-detail.component';

@Component({
  selector: 'syndicate-hardware-scheme-card',
  templateUrl: './hardware-scheme-card.component.html',
  styleUrls: ['./hardware-scheme-card.component.scss']
})
export class HardwareSchemeCardComponent implements OnInit {

  @Input() public station: Station;

  public stations: any[] = [];
  public data: any[] = [];

  constructor(
    private dialog: MatDialog,
    private i18nextService: I18NextService,
    private stationService: StationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  /**
   * Ping menu entry click handler
   *
   * @memberOf {HardwareSchemeCardComponent}
   */
  onPingClick(): void {
    this.dialog.open(PingComponent, {
      data: {
        station: this.station.label,
        ip: this.station.ip
      },
      width: '426px',
      height: '399px',
      autoFocus: false
    });
  }

  /**
   * Detail button click handler
   * Open the Hardware dialog to add or edit
   *
   * @param name - station's name
   * @param data - station's variables
   */
  onDetailClick(name: string, data: Variable[]): void {
    this.dialog.open(HardwareSchemeCardDetailComponent, {
      data: { name, variables: data },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });
  }

  /**
   * Delete one station
   *
   * @param id - id of the station to delete
   * @memberOf {HardwareSchemeCardComponent}
   */
  onRemoveStation(id: string): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('hardware_architecture.delete.confirmation')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.stationService.deleteOne(id).subscribe(
          (res) => {
            if (res) {
              this.stationService.deleteSubject.next(true);
            }
          },
          (error) => {
            console.error(error);
          },
        );
      }
    });
  }

  /**
   * Handler for update menu entry
   *
   * @memberOf {HardwareSchemeCardComponent}
   */
  onEditClick(): void {
    const params: any = {
      id: this.station._id,
      name: this.station.label,
      ip: this.station.ip,
      vComm: JSON.stringify(this.station.vComm),
      vMachine: JSON.stringify(this.station.vMachine),
      variables: JSON.stringify(this.station.variables),
    };
    this.router.navigate(['hardware-architecture', 'create', params]);
  }
}
