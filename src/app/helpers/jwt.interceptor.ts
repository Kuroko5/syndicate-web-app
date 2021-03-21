import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  /**
   * Request interceptor
   * Adding token on the request's header
   * @param request The request
   * @param next Execute the next step
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('currentUserToken');
    let req;

    if (jwt) {
      const splittedUrl = request.url.split('/');

      if ( // Set the request header when the request is to send file
        splittedUrl.includes('documents') &&
        (splittedUrl.includes('upload') || splittedUrl.includes('update'))
      ) {
        req = request.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      } else { // All others requests
        req = request.clone({
          setHeaders: {
            'Content-Type':  'application/json',
            Authorization: `Bearer ${jwt}`,
          }
        });
      }
      return next.handle(req);
    }

    return next.handle(request);
  }
}
