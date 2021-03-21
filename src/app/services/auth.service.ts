import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UserCredentials } from '../models/interfaces/userCredentials';
import { APIService } from './api.service';

@Injectable()
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(private apiService: APIService) {}

  /**
   * Make a http request to the api
   * @param credentials The User's credentials
   */
  public login(credentials: UserCredentials): Observable<any> {
    return this.apiService.post('users/login', credentials);
  }

  /**
   * Get the auth value as observable
   * @return the auth value as observable
   */
  public getAuth(): boolean {
    const token = localStorage.getItem('currentUserToken') || '';

    return !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Decode the token
   * @return The decoded token
   */
  public decodeToken(): any {
    const token = localStorage.getItem('currentUserToken') || '';

    return this.jwtHelper.decodeToken(token);
  }
}
