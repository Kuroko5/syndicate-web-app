import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /**
   * Get current user's rights
   *
   * @method {GET}
   * @return the API response
   * @memberOf {UsersService}
   */
  public getUserRight(): Observable<any> {
    return this.apiService.get('users/right');
  }

  /**
   * Get users with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Name by default)
   */
  public getUsers(page = 1, limit = 25, column = 'username', sort = 1): Observable<any> {
    return this.http.get(`${environment.api_url}users/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('column', column.toString())
        .set('sort', sort.toString())
    });
  }

  /**
   * Update user
   *
   * @method PUT
   * @param userId - The user id to update
   * @param body - body of request with new information
   * @memberOf {UsersService}
   */
  public editUser(userId: string, body: any): Observable<any> {
    return this.apiService.put(`users/${userId}`, body);
  }

  /**
   * Delete the selected user
   * @param id The identity of the user to delete.
   */
  public deleteUser(id): Observable<any> {
    return this.apiService.delete(`users/${id}/delete`);
  }

  /**
   * Create a new user
   *
   * @method POST
   * @param body - body request with information
   * @memberOf {UsersService}
   */
  public create(body: any): Observable<any> {
    return this.apiService.post('users', body);
  }

}
