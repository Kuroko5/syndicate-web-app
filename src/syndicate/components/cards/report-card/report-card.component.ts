import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { ReportsService } from '../../../services/reports.service';
import { DescriptionComponent } from '../../modals/description/description.component';

@Component({
  selector: 'syndicate-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public reports: any[] = [];

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
  ) { }

  /**
   * Fetch recent reports
   */
  private getReports(): void {
    this.reportsService.getCurrentReports().subscribe(
      (reports: any): void => {
        if (reports) {
          this.reports = reports.data;
        }
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }

  ngOnInit() {
    this.getReports();
  }

  /**
   * Get the report by id to display its detail
   *
   * @param reportId The alert id
   * @memberOf {ReportCardComponent}
   */
  displayDefaultDetail(reportId: string): void {
    this.reportsService.getReportById(reportId).subscribe(
      (report: any): void => {
        if (report) {
          this.dialog.open(DescriptionComponent, {
            data: { ...report.data, dates: null },
            width: '928px',
            height: 'auto',
            autoFocus: false
          });
        }
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }
}
