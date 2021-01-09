import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private httpClient: HttpClient) {}

  /**
   * make a http get request
   * @param path the api path
   */
  get(path: string): Observable<any> {
    return this.httpClient.get<any>(environment.api_url + path);
  }

  /**
   * make a http post request
   *
   * @param path the api path
   * @param body the http body
   */
  post(path: string, body: object): Observable<any> {
    return this.httpClient.post<any>(environment.api_url + path, body);
  }

    /**
   * make a http put request
   *
   * @param path the api path
   * @param body the http body
   */
  put(path: string, body: object): Observable<any> {
    return this.httpClient.put<any>(environment.api_url + path, body);
  }

  /**
   * make a http delete request
   * @param path the api path
   */
  delete(path: string): Observable<any> {
    return this.httpClient.delete(environment.api_url + path);
  }

  /**
   * make a http post request to upload files
   * @param path the api path
   * @param body the http body
   * @param options the http options
   */
  public uploadFiles(path: string, body: object): Observable<any> {
    return this.httpClient.post<any>(environment.api_url + path, body, {
      reportProgress: true,
      responseType: 'blob',
      observe: 'events'
    });
  }
}
