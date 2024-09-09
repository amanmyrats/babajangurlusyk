import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4OTU4NzcyLCJpYXQiOjE3MTg5NTg0NzIsImp0aSI6ImM3ZGU1ZGIxMmRlOTQzOTJhNTFhNGIwZjExMDA5YmFjIiwidXNlcl9pZCI6MX0.e_OJtMJVQ_FNhGvm3uvMVToJ7RBi5vDOefG5IAUFjno'
  const authToken = authService.currentAccessToken;
  const router = inject(Router);

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log('Added access token to request');
  console.log('Bearer: ' + authToken);
  console.log(authReq);

  // Pass the cloned request with the updated header to the next handler
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {
          // Specific handling for unauthorized errors         
          console.error('Inside jwt.interceptor: Unauthorized request:', err);
          authService.logout();
          router.navigate(['/login']);

          // Check for refresh method in AuthService
          // if (authService.refreshToken && !!authToken) {
          //   console.log("Inside: interceptor -> authService.refreshToken")
          //   return authService.refreshToken().pipe(
          //     switchMap((response) => {
          //       if (response && response.access) {
          //         // Update access token
          //         authService.setAccessToken(response.access);
          //         // Retry with new access token
          //         const refreshedReq = req.clone({
          //           setHeaders: { Authorization: `Bearer ${response.access}` },
          //         });
          //         return next(refreshedReq);
          //       }
          //       return throwError('Refresh token failed'); // Handle refresh failure
          //     })
          //   );
          // } else {
          //     // No refresh method, handle expired token (e.g., logout)
          //     authService.logout();
          //     return throwError('Unauthorized: Token may have expired');
          // }

        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);

        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err); 
    })
  );

  
};


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(private authService: AuthService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const accessToken = this.authService.currentAccessToken;
//     if (accessToken) {
//       request = this.addToken(request, accessToken);
//       console.log('Added token to request');
//       console.log(request);
//     }

//     return next.handle(request).pipe(
//       catchError(error => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {
//             console.log('Handling 401 error');
//           return this.handle401Error(request, next);
//         } else {
//           return throwError(error);
//         }
//       })
//     );
//   }

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((token: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(token.access);
//           return next.handle(this.addToken(request, token.access));
//         }),
//         catchError((error) => {
//           this.isRefreshing = false;
//           this.authService.logout();
//           return throwError(error);
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(jwt => {
//           return next.handle(this.addToken(request, jwt));
//         })
//       );
//     }
//   }
// }
