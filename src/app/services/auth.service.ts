import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { iaccessData } from '../models/iaccess-data';
import { iUser } from '../models/i-user';
import { iLogin } from '../models/i-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  jwtHelper: JwtHelperService = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  authSubject$ = new BehaviorSubject<iaccessData | null>(null);

  user$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => accessData?.user));

  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  isLoggedIn: boolean = false;

  register(newUser: Partial<iUser>) {
    return this.http.post<iaccessData>(this.registerUrl, newUser);
  }

  login(authData: iLogin) {
    return this.http.post<iaccessData>(this.loginUrl, authData).pipe(
      tap((userAccessData) => {
        this.authSubject$.next(userAccessData);

        localStorage.setItem('userAccessData', JSON.stringify(userAccessData));

        const token = this.jwtHelper.getTokenExpirationDate(
          userAccessData.accessToken
        ) as Date;

        if (!token) return;
        this.autoLogout(token);
      })
    );
  }

  logout() {
    this.authSubject$.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/auth/login']);
  }

  autoLogoutTimer: any;

  autoLogout(token: Date) {
    clearTimeout(this.autoLogoutTimer);
    const expMs = token.getTime() - new Date().getTime();

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: iaccessData = JSON.parse(userJson);

    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) {
      localStorage.removeItem('accessData');
      return;
    }

    this.authSubject$.next(accessData);
  }
}
