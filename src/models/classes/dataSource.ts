import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';


export class DataSourceClass extends DataSource<any[]> {

  constructor(private subject: BehaviorSubject<any[]>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[][] | readonly any[][]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }


}
