import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && req.method !== 'GET') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `${req.method} request successful!`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let message = 'An unknown error occurred';

      if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (error.statusText) {
        message = error.statusText;
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      });

      throw error;
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
