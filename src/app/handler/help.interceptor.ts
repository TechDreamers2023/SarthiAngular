import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HelpInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (localStorage.getItem('access-token') != null) {
      const token = localStorage.getItem('access-token');
      // if the token is  stored in localstorage add it to http header
      const headers = new HttpHeaders().set("access-token", token);
      //clone http to the custom AuthRequest and send it to the server 
      const AuthRequest = request.clone({ headers: headers });
      return next.handle(AuthRequest)
    } else {

      return next.handle(request).pipe(
        tap({
          next: (event) => {
            if (event instanceof HttpResponse) {
              if (event.status == 401) {
                alert('Unauthorized access!')
              }
            }
            return event;
          },
          error: (error) => {
            if (error.status === 401) {
              alert('Unauthorized access!')
            }
            else if (error.status === 404) {
              alert('Page Not Found!')
            }
          }
        }));
    }
  }
}
