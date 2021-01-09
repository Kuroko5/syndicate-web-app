import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CountersService extends APIService {

  constructor(
    private _httpClient: HttpClient,
    private apiService: APIService
  ) {
    super(_httpClient);
  }

  /**
   * Get all the counters
   * @param page - the desired page (first page by default)
   * @param limit - the number of the displayed data (25 by default)
   * @param sort - the applied sort, ASC (1) or DESC (-1) (ASC by default)
   * @param column - the selected column to apply the sort (label by default)
   * @param search The value of the searchBar
   * @return API response
   * @memberOf {CountersService}
   */
  getAll(page: number = 1, limit: number = 25, column: string = 'label', sort: number = 1, search: string): Observable<any> {
    return this._httpClient.get(`${environment.api_url}counters`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('column', column.toString())
        .set('sort', sort.toString())
        .set('search', search.toString())
    });
  }
  /**
   * Create Counter
   * @param data - Data to send for create counter
   * @return API response
   * @memberOf {CountersService}
   */
  addCounter(data: any): Observable<any> {
    return this.apiService.post(`counters`, data);
  }

  /**
   * Edit Counter
   * @param id - identifiant of the counter
   * @param data - Data to send for create counter
   * @return API response
   * @memberOf {CountersService}
   */
  editCounter(id: string, data: any): Observable<any> {
    return this.apiService.put(`counters/${id}`, data);
  }
}
