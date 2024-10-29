import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { iUser } from '../models/i-user';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, router: Router) {}

  userUrl = environment.userUrl;

  getUsers(): Observable<iUser[]> {
    return this.http.get<iUser[]>(this.userUrl);
  }

}
