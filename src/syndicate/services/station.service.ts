import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { APIService } from './api.service';

@Injectable()
export class StationService extends APIService {

  public deleteSubject: Subject<boolean>;

  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient);
    this.deleteSubject = new Subject<boolean>();
  }

  /**
   * Utility method to get the subject as an observable
   *
   * @return - subject transformed into an observable
   * @memberOf {StationService}
   */
  getDeleteSubjectAsObs(): Observable<boolean> {
    return this.deleteSubject.asObservable();
  }

  /**
   * Retrieve the list of all the stations
   *
   * @method {GET}
   * @return - the API response
   * @memberOf {StationService}
   */
  getAll(): Observable<any> {
    return this.get('stations');
  }

  /**
   * Get station state
   *
   * @method {POST}
   * @param ip The station IP address
   * @return - the API response
   * @memberOf {StationService}
   */
  ping(ip: string): Observable<any> {
    return this.post(`stations/ping`, {
      ip
    });
  }

  /**
   * Delete one station
   *
   * @method {DELETE}
   * @param stationId The station id to delete.
   * @return - the API response
   * @memberOf {StationService}
   */
  deleteOne(stationId: string): Observable<any> {
    return this.delete(`stations/${stationId}/delete`);
  }

  /**
   * Create one station
   *
   * @method {POST}
   * @param body - new station info
   * @return - API response
   * @memberOf {StationService}
   */
  createOne(body: any): Observable<any> {
    return this.post('stations', body);
  }

  /**
   * Update one station
   *
   * @method {PUT}
   * @param id - id of the station to be updated
   * @param body - modified station info
   * @return - API response
   * @memberOf {StationService}
   */
  updateOne(id: string, body: any): Observable<any> {
    return this.put(`stations/${id}`, body);
  }

  /**
   * Update the position of stations
   *
   * @method {PUT}
   * @param body - modified stations position
   * @return - API response
   * @memberOf {StationService}
   */
  updatePosition(body: any): Observable<any> {
    return this.put('stations/position', body);
  }
}
