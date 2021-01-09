import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService extends APIService {

  constructor(
    private _httpClient: HttpClient
  ) {
    super(_httpClient);
  }

  /**
   * Get all the cards for database
   *
   * @return API response
   * @memberOf {CardsService}
   */
  getAll(): Observable<any> {
    return super.get('cards');
  }

  /**
   * Create a card
   *
   * @param req - body of request
   * @return API response
   * @memberOf {CardsService}
   */
  create(req: any): Observable<any> {
    return super.post(`cards`, req);
  }

  /**
   * Delete a card from its id
   *
   * @param id - id of card to delete
   * @return API response
   * @memberOf {CardsService}
   */
  delete(id: string): Observable<any> {
    return super.delete(`cards/${id}`);
  }

  /**
   * Update a card from its id
   *
   * @param id - id of card to update
   * @return API response
   * @memberOf {CardsService}
   */
  edit(id: string, body: any): Observable<any> {
    return super.put(`cards/${id}`, body);
  }

  /**
   * Change order of dashboard cards
   *
   * @param ids - list of cards in the new order
   * @return API response
   * @memberOf {CardsService}
   */
  order(ids: any): Observable<any> {
    return super.put('cards/position', ids);
  }
}
