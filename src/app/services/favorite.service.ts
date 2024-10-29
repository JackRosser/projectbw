import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iFavoriteUser } from '../models/i-favorite-user';
import { BehaviorSubject, filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  userFavUrl = environment.userFavUrl;

  // private arrPref: iFavoriteUser[] = [];

  // private userFavorite$ = new BehaviorSubject<iFavoriteUser[]>(this.arrPref);

  // pref$ = this.userFavorite$.asObservable();

  // constructor(private hhtp: HttpClient) {}

  // loadFavorite(userId: number): void {
  //   if (userId < 0) {
  //     console.error('utente non valido', userId);
  //     return;
  //   }
  //   this.getPreferiti(userId).pipe(
  //     filter(Boolean),
  //     tap((data) => {
  //       this.arrPref = data;
  //       this.userFavorite$.next(this.arrPref);

  //     })

  //   );
  //   .subscribe({

  //   })
  // }
}
