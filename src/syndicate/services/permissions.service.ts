import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /**
   * Get the list of all available permissions
   *
   * @return - API result
   * @memberOf {PermissionsService}
   */
  public getPermissions(): Observable<any> {
    return this.apiService.get(`permissions/`);
  }
}
