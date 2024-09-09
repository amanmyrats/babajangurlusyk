import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = env.baseUrl;
  private endPoint = 'auth/'
  private refreshInProgress = false;

  private accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<string>('');
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient, 
    
  ) { 
    this.accessTokenSubject.next(this.currentAccessToken);
    this.refreshTokenSubject.next(this.currentRefreshToken);
  }


  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}${this.endPoint}api/token/`, { username, password })
      .pipe(
        map(response => {
          console.log(response);
          if (response && response.access) {
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);
            localStorage.setItem('userId', response.user_id);
            localStorage.setItem('firstName', response.first_name);
            localStorage.setItem('isSuperuser', response.is_superuser);
            localStorage.setItem('roleName', response.role);
            this.accessTokenSubject.next(response.access);
            this.refreshTokenSubject.next(response.refresh);
            return true;
          }
          return false;
        })
      );
  }
  // refreshToken() {
  //   return this.http.post<any>(
  //     `${this.baseUrl}${this.endPoint}api/token/refresh/`, 
  //     { refresh: this.currentRefreshToken });
  // }

  refreshToken(): Observable<any> {
    console.log('inside: authService.refreshToken()')
    return this.refreshTokenSubject.pipe(
      switchMap(refreshToken => {
        console.log('refreshToken: ' + refreshToken)
        console.log('this.refreshInProgress: ' + this.refreshInProgress)
        if (!refreshToken || this.refreshInProgress) {
          return of(null);
        }
        this.refreshInProgress = true;
        console.log("Sending refresh token.")
        return this.http.post<any>(
          `${this.baseUrl}${this.endPoint}api/token/refresh/`, 
          { refresh: refreshToken })
          .pipe(
            // Use map operator within the projection function
            map(response => {
              if (response && response.access) {
                localStorage.setItem('accessToken', response.access);
                this.refreshTokenSubject.next(response.refresh);
              }
              return response;
            }),
            catchError(error => {
              this.logout();
              throw error;
            }),
            finalize(() => {
              this.refreshInProgress = false;
            })
          );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('isSuperuser');
    localStorage.removeItem('roleName');
    this.accessTokenSubject.next('');
    this.refreshTokenSubject.next('');
  }

  public get currentAccessToken(): string | null {
    return localStorage.getItem('accessToken');
    // Access the current value using getValue()
    // return this.accessTokenSubject.getValue();
  }

  setAccessToken(accessToken: string): void {
    return localStorage.setItem('accessToken', accessToken);
  }

  
  public get currentRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
    // Access the current value using getValue()
    // return this.refreshTokenSubject.getValue();
  }

  public get accessTokenChanges(): Observable<string> {
    return this.accessTokenSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.currentAccessToken;
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.endPoint}changepassword/`, 
      { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword});
  }
}
