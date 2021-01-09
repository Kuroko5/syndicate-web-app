import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable()
export class ConditionsService {

  constructor(private apiService: APIService) {}

  /**
   * Get conditions with limit or not
   * @param limit The limit of received data
   */
  getConditions(limit = null, sort = 1, column = 'descr'): Observable<any> {
    if (limit) {
      return this.apiService.get(`conditions?limit=${limit}`);
    }
    return this.apiService.get(`conditions?sort=${sort}&column=${column}`);
  }

  /**
   * Return the selected condition
   * @param id The condition id
   */
  getConditionById(id: string): Observable<any> {
    return this.apiService.get(`conditions/${id}`);
  }

  /**
   * Get the selected conditions
   * @method {PUT}
   * @param conditions - the array of selected conditions
   * @return - API response
   * @memberOf {ConditionsService}
   */
  getSelectedConditions(conditions: string[]): Observable<any> {
    return this.apiService.put('conditions/selected', { conditions });
  }
}
