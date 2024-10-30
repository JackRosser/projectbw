import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { iUser } from '../models/i-user';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, router: Router) {this.getAllUsers()}

  private usersBh = new BehaviorSubject<iUser[]>([])
  allUser$ = this.usersBh.asObservable()


  getAllUsers():void {
    this.http.get<iUser[]>(environment.userUrl).subscribe(list => {
      this.usersBh.next(list)
    })
    }

  getUsers(): Observable<iUser[]> {
    return this.http.get<iUser[]>(environment.userUrl);
  }



}




