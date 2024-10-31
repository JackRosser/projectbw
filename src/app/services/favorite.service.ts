import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iFavoriteUser } from '../models/i-favorite-user';
import { iFavoriteGame } from '../models/i-favorite-game'; // Assicurati di importare l'interfaccia corretta
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private userFavUrl = environment.userFavUrl;
  private favoriteGamesUrl = environment.gamesFavUrl;

  private favoritesSubject = new BehaviorSubject<iFavoriteUser[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient, private authSrv: AuthService) {}

  // Ottieni i preferiti degli utenti
  getFavorites(): Observable<iFavoriteUser[]> {
    return this.http
      .get<iFavoriteUser[]>(this.userFavUrl)
      .pipe(tap((favorites) => this.favoritesSubject.next(favorites)));
  }

  // Aggiungi un utente ai preferiti
  addFavorite(favoriteUser: iFavoriteUser): Observable<iFavoriteUser> {
    return this.http.post<iFavoriteUser>(this.userFavUrl, favoriteUser).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, favoriteUser]);
      })
    );
  }

  // Rimuovi un utente dai preferiti
  removeFavorite(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.userFavUrl}/${userId}`).pipe(
      tap(() => {
        const updatedFavorites = this.favoritesSubject.value.filter(
          (fav) => fav.userId !== userId
        );
        this.favoritesSubject.next(updatedFavorites);
      })
    );
  }

  // Verifica se un utente è nei preferiti
  isFavorite(userId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map((favorites) => favorites.some((fav) => fav.userId === userId))
    );
  }

  // Ottieni i preferiti per l'utente attuale
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

  // Ottieni i giochi preferiti per un utente specifico
  getFavoriteGamesForUser(userId: number): Observable<iFavoriteGame[]> {
    return this.http.get<iFavoriteGame[]>(`${this.favoriteGamesUrl}/?userId=${userId}`);
  }

  // Aggiorna i preferiti nel localStorage
  updateFavoritesInStorage(favorites: iFavoriteUser[]): void {
    const favoriteIds = favorites.map((fav) => fav.userId);
    localStorage.setItem('matchedUsers', JSON.stringify(favoriteIds));
  }
}
