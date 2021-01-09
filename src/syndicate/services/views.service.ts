import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICreateViewRequest } from '../../models/interfaces/api/create-view.interface';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ViewsService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /* Get a view info */
  public getView(name: String): Observable<any> {
    return this.apiService.get(`views/info/${name}`);
  }

  /**
   * Get views with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Name by default)
   */
  public getViews(page = 1, limit = 25, column = 'label', sort = 1): Observable<any> {
    return this.http.get(`${environment.api_url}views/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('column', column.toString())
        .set('sort', sort.toString())
    });
  }

  /**
   * Create a view
   *
   * @method {POST}
   * @param req - The request
   * @return this api response
   * @memberOf {ViewsService}
   */
  public createView(req: ICreateViewRequest): Observable<any> {
    return this.apiService.post('views', req);
  }

  /**
   * Update an existing view
   *
   * @method {PUT}
   * @param id - id of the view to update
   * @param req - body request
   * @return API response
   * @memberOf {ViewsService}
   */
  public updateView(id: string, req: ICreateViewRequest): Observable<any> {
    return this.apiService.put(`views/${id}`, req);
  }

  /**
   * Delete the selected view
   *
   * @method {DELETE}
   * @param id The id
   * @return the API response
   * @memberOf {ViewsService}
   */
  public deleteView(id): Observable<any> {
    return this.apiService.delete(`views/${id}/delete`);
  }

  /**
   * Get the list of all the views
   *
   * @method GET
   * @return API response
   * @memberOf {ViewsService}
   */
  public getAll(): Observable<any> {
    return this.apiService.get('views/all');
  }

  /**
   * Update the position of views
   *
   * @method {PUT}
   * @param body - modified views position
   * @return - API response
   * @memberOf {ViewsService}
   */
  updatePosition(body: any): Observable<any> {
    return this.apiService.put('views/position', body);
  }
}
