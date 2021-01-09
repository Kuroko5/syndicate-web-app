import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable()
export class DocumentsCategoriesService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  /**
   * Get documents Categories
   */
  public getDocumentsCategories(): Observable<any> {
    return this.apiService.get(`documents/categories`);
  }

  /**
   * Get documentsTypes
   */
  public getDocumentsTypes(): Observable<any> {
    return this.apiService.get(`documentsTypes`);
  }

  /**
   * Edit a document Category
   * @param id The category Id
   * @param label The new label
   */
  public editDocumentCategory(id: string, label: Object): Observable<any> {
    return this.apiService.put(`documents/categories/${id}`, label);
  }

  /**
   * Add a document Category
   * @param id The category Id
   * @param label The new label
   */
  public addDocumentCategory(label: Object): Observable<any> {
    return this.apiService.post(`documents/categories/`, label);
  }

  /**
   * Delete a document Category
   * @param id The category Id
   * @param data The new category for transfert document
   */
  public deleteDocumentCategory(id, data?: any): Observable<any> {
    return this.apiService.put(`documents/categories/${id}/delete`, data);
  }
}
