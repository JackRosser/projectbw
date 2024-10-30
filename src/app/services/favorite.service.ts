import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iFavoriteUser } from '../models/i-favorite-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private userFavUrl = environment.userFavUrl;

  private favoritesSubject = new BehaviorSubject<iFavoriteUser[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient, private authSrv: AuthService) {}

  getFavorites(): Observable<iFavoriteUser[]> {
    return this.http
      .get<iFavoriteUser[]>(this.userFavUrl)
      .pipe(tap((favorites) => this.favoritesSubject.next(favorites)));
  }

  addFavorite(favoriteUser: iFavoriteUser): Observable<iFavoriteUser> {
    return this.http.post<iFavoriteUser>(this.userFavUrl, favoriteUser).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, favoriteUser]);
      })
    );
  }

  removeFavorite(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.userFavUrl}/${userId}`).pipe(
      tap(() => {
        const updatedFavorites = this.favoritesSubject.value.filter(
          (fav) => fav.userId !== userId
        );
        console.log('Aggiornamento dei preferiti:', updatedFavorites);
        this.favoritesSubject.next(updatedFavorites);
      })
    );
  }

  isFavorite(userId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map((favorites) => favorites.some((fav) => fav.userId === userId))
    );
  }

  getFavoritesForCurrentUser(): Observable<iFavoriteUser[]> {
    const userId = this.authSrv.getUserId();
    if (userId) {
      return this.http
        .get<iFavoriteUser[]>(`${this.userFavUrl}/?userId=${userId}`)
        .pipe(tap((favorites) => this.favoritesSubject.next(favorites)));
    } else {
      return new Observable<iFavoriteUser[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
  }

  updateFavoritesInStorage(favorites: iFavoriteUser[]): void {
    const favoriteIds = favorites.map((fav) => fav.userId);
    localStorage.setItem('matchedUsers', JSON.stringify(favoriteIds));
  }
}
