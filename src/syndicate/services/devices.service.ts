import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class DevicesService extends APIService {

  constructor(
    private _httpClient: HttpClient, private apiService: APIService
  ) {
    super(_httpClient);
  }

  /**
   * Get all the devices
   * @param page - the desired page (first page by default)
   * @param limit - the number of the displayed data (25 by default)
   * @param sort - the applied sort, ASC (1) or DESC (-1) (DESC by default)
   * @param column - the selected column to apply the sort (vId by default)
   * @return API response
   * @memberOf {DevicesService}
   */
  getAll(page: number = 1, limit: number = 25, column: string = 'createdAt', sort: number = -1): Observable<any> {
    return this._httpClient.get(`${environment.api_url}devices`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('column', column.toString())
        .set('sort', sort.toString())
    });
  }

  /**
   * Get all equipmentId sorted by machineId
   * @return API response
   * @memberOf {DevicesService}
   */
  getMachine(): Observable<any> {
    return super.get('devices/machineId');
  }

  /**
   * Add device
   * @param data - data for create device
   * @return API response
   * @memberOf {DevicesService}
   */
  addDevice(data: any): Observable<any> {
    return this.apiService.post(`devices`, data);
  }

  /**
   * Edit device
   * @param id - id of device
   * @param data - data to update
   * @return API response
   * @memberOf {DevicesService}
   */
  editDevice(id: string, data: any): Observable<any> {
    return this.apiService.put(`devices/${id}`, data);
  }

  /**
   * Delete the selected device
   *
   * @method {DELETE}
   * @param id The id
   * @return the API response
   * @memberOf {ViewsService}
   */
  public deleteDevice(id: string): Observable<any> {
    return this.apiService.delete(`devices/${id}/delete`);
  }
}
