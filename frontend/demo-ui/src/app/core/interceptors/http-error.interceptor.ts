import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpContextToken,
} from '@angular/common/http';
import { Observable, catchError, EMPTY, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

export const SKIP_GLOBAL_ERROR = new HttpContextToken<boolean>(() => false);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        const skip = req.context.get(SKIP_GLOBAL_ERROR);

        // offline → global
        if (error?.status === 0 || error?.error instanceof ProgressEvent) {
          this.errorHandler.handle(error);
          return EMPTY;
        }

        // normal → global
        if (!skip) {
          this.errorHandler.handle(error);
          return EMPTY;
        }

        // skip → propagate
        return throwError(() => error);
      }),
    );
  }
}
