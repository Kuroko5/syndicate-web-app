import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';

@Injectable()
export class DocumentsService {

  constructor(private http: HttpClient, private apiService: APIService) {}
  /**
   * Get documents with pagination and sorting
   * @param page The desired page (first page by default)
   * @param limit The number of the displayed data (25 by default)
   * @param sort The applied sort, ASC or DESC (ASC by default)
   * @param column The selected column to apply the sort (Name by default)
   */
  public getDocuments(page = 1, limit = 25, sort = 1, column = 'title', type = 'all', search = '', category: string): Observable<any> {
    let c: string = null;
    if (category !== undefined) {
      c = category.toString();
    }
    return this.http.get(`${environment.api_url}documents/all`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('column', column.toString())
        .set('type', type.toString())
        .set('search', search.toString().toLowerCase())
        .set('category', c),
    });
  }

  /**
   * Upload file
   * @params file Selected file to send
   */
  public uploadDocument(file: any): Observable<any> {
    return this.apiService.uploadFiles(`documents/upload`, file);
  }

  /**
   * Get the file
   * @param id The name of the file
   */
  public displayDocument(id: string): Observable<any> {
    return this.http.get(`${environment.api_url}documents/file/${id}`, { responseType: 'arraybuffer' });
  }

  /**
   * Delete a document by id
   * @param documentId The document id
   */
  public deleteDocument(documentId: string): Observable<any> {
    return this.apiService.delete(`documents/delete/${documentId}`);
  }

  /**
   * Get a document by id
   * @param documentId The document id
   */
  public getDocumentById(documentId: string): Observable<any> {
    return this.apiService.get(`documents/${documentId}`);
  }

  /**
   * Edit a selected document
   * @param reportId The document Id
   * @param report The current document to modifying
   */
  public editDocument(documentId: string, file: any): Observable<any> {
    return this.apiService.uploadFiles(`documents/update/${documentId}`, file);
  }

  /**
   * Get all documentsTypes
   */
  public getDocumentsTypes(): Observable<any> {
    return this.apiService.get(`documentsTypes`);
  }

}
