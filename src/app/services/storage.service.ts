import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable()
export class SyndicateStorageService {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService) {}

  /**
   * Save the sorting in the session storage
   * @param key The key name
   * @param sort The sorting to store
   */
  public storeSorting(key: string, sort: any): void {
    this.storage.set(key, sort);
  }

  /**
   * Fetch sorting in the session storage
   * @param key The key name
   */
  public fetchSorting(key: string): any {
    return this.storage.get(key) || null ;
  }

  /**
   * Clear all data in the session storage
   */
  public clearSessionStorage(): void {
    this.storage.clear();
  }

  /**
   * Save data in the local storage
   * @param key The key name
   * @param sort The data to store
   */
  public storeInLocal(key: string, data: any): void {
    this.localStorage.set(key, data);
  }

  /**
   * Fetch data in the local storage
   * @param key The key name
   */
  public fetchInLocal(key: string): any {
    return this.localStorage.get(key) || null ;
  }
}
