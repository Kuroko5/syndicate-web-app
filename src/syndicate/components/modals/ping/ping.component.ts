import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StationService } from '../../../services/station.service';

@Component({
  selector: 'syndicate-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {
  public finish: boolean = false;
  public state: boolean = false;
  public time: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stationService: StationService) {}

  /**
   * Ping a host
   * @param ip The station IP address
   */
  private ping(ip: string): void {
    this.stationService.ping(ip).subscribe(
      (res) => {
        if (res) {
          this.finish = true;
          this.state = res.state;
          this.time = res.time;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  ngOnInit() {
    this.ping(this.data.ip);
  }

}
