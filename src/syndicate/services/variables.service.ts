import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable()
export class VariablesService {

  constructor(private http: HttpClient, private apiService: APIService) {}

  /**
   * Get the first five variables
   */
  public getCurrentVariables(): Observable<any> {
    return this.apiService.get(`variables/currents`);
  }

  /**
   * Get the selected variables
   * @method {PUT}
   * @param variables - the array of selected variables
   * @return - API response
   * @memberOf {VariablesService}
   */
  getSelectedVariables(variables: string[]): Observable<any> {
    return this.apiService.put('variables/selected', { variables });
  }


  /**
   * Get variables with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (vId by default)
   * @param category The category of the variable
   * @param search The value of the searchBar
   */
  public getVariables(page = 1, limit = 25, sort = 1, column = 'vId', category = 'all', search = ''): Observable<any> {
    return this.http.get(`${environment.api_url}variables/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('category', category.toString())
        .set('search', search.toString().toLowerCase())
    });
  }

  /**
   * Get variables with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (vId by default)
   * @param category The category of the variable
   * @param search The value of the searchBar
   */
  public getVariablesConfiguration(
    page: number = 1,
    limit: number = 25,
    sort: number = 1,
    column: string = 'vId',
    search: string = '',
    deviceId: string = '',
    machineId: string = '',
    equipmentId: string = '',
    category: string = 'all',
    ): Observable<any> {
    return this.http.get(`${environment.api_url}variables/configuration`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('category', category.toString())
        .set('search', search.toString().toLowerCase())
        .set('deviceId', deviceId.toString())
        .set('machineId', machineId.toString())
        .set('equipmentId', equipmentId.toString())
    });
  }

  /**
   * Get a variable detail by vId
   * @param variableId The id of the selected variable
   */
  public getVariableById(variableId: string): Observable<any> {
    return this.apiService.get(`variables?vId=${variableId}`);
  }

  /**
   * Get variables by earch categories and filter
   * Filter by searching and/or selected category
   * @param filter The applying filter (searching and/or category)
   */
  public getVariablesByCategories(filter: any): Observable<any> {
    return this.apiService.get(
      `variables/categories?category=${filter.category}&search=${filter.search}&format=${filter.format}&type=${filter.type}`
    );
  }

  /**
   * Get all data for each variables by sending her id
   * @param variables List of variables id
   */
  public getVariablesHistorical(variables, dates): Observable<any> {

    const vIds = [];

    variables.forEach((v) => {
      vIds.push(v.vId);
    });

    return this.apiService.post(`variables/history`, {
      array: [...vIds],
      dates: {
        min: dates.min,
        max: dates.max
      }
    });
  }

  /**
   * Edit the advice of a variable
   * @param advice The advice
   */
  public editAdvice(id, advice): Observable<any> {
    return this.apiService.put(`variables/${id}/advice`, advice);
  }

  /**
   * Get variables card info
   * @method {GET}
   * @param id - the id of the card
   * @return - API response
   * @memberOf {VariablesService}
   */
  getCard(id: string): Observable<any> {
    return this.apiService.get(`variables/card/${id}`);
  }

  /**
   * Get list of deviceId
   * @method {GET}
   * @return - API response
   * @memberOf {VariablesService}
   */
  getDeviceId(): Observable<any> {
    return this.apiService.get('variables/devices');
  }

  /**
   * Get list of VariablesCategories
   * @method {GET}
   * @return - API response
   * @memberOf {VariablesService}
   */
  getVariablesCategories(): Observable<any> {
    return this.apiService.get('variables/categories/all');
  }

  /**
   * Get list of VariablesTypes
   * @method {GET}
   * @return - API response
   * @memberOf {VariablesService}
   */
  getVariablesTypes(): Observable<any> {
    return this.apiService.get('variables/devices');
  }

  /**
   * Create a new Variable
   * @methode {POST}
   * @return - API response
   * @memberOf {VariablesService}
   */
  addVariable(data: any): Observable<any> {
    return this.apiService.post('variables/', data);
  }

  /**
   * Edit a Variable
   * @methode {PUT}
   * @return - API response
   * @memberOf {VariablesService}
   */
  editVariable(id: string, data: any): Observable<any> {
    return this.apiService.put(`variables/${id}`, data);
  }

  /**
   * Delete a variable
   * @method {DELETE}
   * @param id - the id of the variable
   * @return - API response
   * @memberOf {VariablesService}
   */
  delete(id: string): Observable<any> {
    return this.apiService.delete(`variables/${id}`);
  }

  /**
   * Export variables to csv
   * @method {GET}
   * @return - API response
   * @memberOf {VariablesService}
   */
  export(): Observable<any> {
    return this.http.get(`${environment.api_url}variables/export`, {
      responseType: 'blob'
    });
  }

  /**
   * Import variables from csv
   * @method {POST}
   * @return - API response
   * @memberOf {VariablesService}
   */
  import(file: any): Observable<any> {
    return this.apiService.uploadFiles(`variables/upload`, file);
  }

}
