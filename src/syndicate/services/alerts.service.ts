import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable()
export class AlertsService {

  constructor(private http: HttpClient, private apiService: APIService) {}

  /**
   * Get alert with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Date by default)
   * @param type The type of the alert
   */
  public getAlerts(page = 1, limit = 25, sort = 1, column = 'd', type = 'default', category = 'all'): Observable<any> {
    return this.http.get(`${environment.api_url}samples/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('type', type.toString())
        .set('category', category.toString())
    });
  }

    /**
   * Get historical with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Date by default)
   */
  public getHistorical(page = 1, limit = 25, sort = 1, column = 'd', category = 'all', dates, search = ''): Observable<any> {
    return this.http.post<any>(`${environment.api_url}samples/history`, {
      dates: {
        min: dates.min,
        max: dates.max
      }
    },                         {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('category', category.toString())
        .set('search', search.toString())
    });
  }

  /**
   * Get the last five current alerts
   * @param alertType The type of the alert (default or alarm)
   */
  public getCurrentAlerts(alertType: string): Observable<any> {
    return this.apiService.get(`samples/${alertType}`);
  }

  /**
   * Get the selected variables (default or alarm)
   * @method {PUT}
   * @param alertType - the type of the variables (default or alarm)
   * @param variables - the array of variables (default or alarm)
   * @return - API response
   * @memberOf {AlertsService}
   */
  getSelectedAlerts(alertType: string, variables: string[]): Observable<any> {
    return this.apiService.put(`samples/selected?type=${alertType}`, { variables });
  }

  /**
   * Get the detail of the selected alert
   * @param id The alert's id
   */
  public getAlertById(id: string): Observable<any> {
    return this.apiService.get(`samples?vId=${id}`);
  }
}
