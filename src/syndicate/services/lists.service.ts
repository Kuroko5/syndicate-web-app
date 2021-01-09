import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private apiService: APIService) {}

  /**
   * Get all categories used on the app
   */
  getAllCategories(): Observable<any> {
    return this.apiService.get(`variables/categories/all`);
  }

  /**
   * get all types used on the app
   */
  getAllTypes(): Observable<any> {
    return this.apiService.get(`reportTypes`);
  }
}
