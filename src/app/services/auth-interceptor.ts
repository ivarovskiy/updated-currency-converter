import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      url: 'https://openexchangerates.org/api' + request.url,
      setParams: {
        app_id: '2987803a4aad4f309b3c374e2b0931ad',
      },
    });

    return next.handle(modifiedRequest);
  }
}
