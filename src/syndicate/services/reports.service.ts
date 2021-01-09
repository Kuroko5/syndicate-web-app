import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable()
export class ReportsService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /**
   * Get reports with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Name by default)
   */
  public getReports(page = 1, limit = 25, sort = -1, column = 'createdAt', type = 'all', search = ''): Observable<any> {
    return this.http.get(`${environment.api_url}reports/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('type', type.toString())
        .set('search', search.toString().toLowerCase())
    });
  }

  /**
   * Get the last five reports
   */
  public getCurrentReports(): Observable<any> {
    return this.apiService.get(`reports/currents`);
  }

  /**
   * Get report detail
   * @param reportId The report id
   */
  public getReportById(reportId: string): Observable<any> {
    return this.apiService.get(`reports/${reportId}`);
  }

  /**
   * Create a new report
   * @param report The report to create
   */
  public createReport(report): Observable<any> {
    return this.apiService.put(`reports/new`, {
      name: report.name,
      reportTypeId: report.reportTypeId,
      operator: report.operator,
      description: report.description
    });
  }

  /**
   * Edit a selected report
   * @param reportId The report Id
   * @param report The current report to modifying
   */
  public editReport(reportId, report): Observable<any> {
    return this.apiService.put(`reports/update/${reportId}`, {
      name: report.name,
      reportTypeId: report.reportTypeId,
      operator: report.operator,
      description: report.description
    });
  }

  /**
   * Delete the selected report
   * @param reportId The report id
   */
  public deleteReport(reportId): Observable<any> {
    return this.apiService.delete(`reports/delete/${reportId}`);
  }
}
