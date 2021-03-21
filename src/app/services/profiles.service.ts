import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile } from '../models/api/profile.model';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /**
   * Get profiles with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Name by default)
   */
  public getProfiles(page = 1, limit = 25, column = 'name', sort = 1): Observable<any> {
    return this.http.get(`${environment.api_url}profiles/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('column', column.toString())
        .set('sort', sort.toString())
    });
  }

  /**
   * Edit a profile
   * @param id The id of the profile
   * @param profile The profile
   */
  public editProfile(id, profile): Observable<any> {
    return this.apiService.put(`profiles/${id}`, profile);
  }

  /**
   * Create a profile
   * @param profile The profile
   */
  public createProfile(profile: Profile): Observable<any> {
    return this.apiService.post('profiles', profile);
  }

  /**
   * Delete the selected profile
   * @param id - The id of the profile
   */
  public delete(id: string): Observable<any> {
    return this.apiService.delete(`profiles/${id}/delete`);
  }

  /**
   * Get the list of all profiles
   *
   * @method GET
   * @return - API response
   * @memberOf {ProfilesService}
   */
  public getAll(): Observable<any> {
    return this.apiService.get('profiles/all');
  }
}
