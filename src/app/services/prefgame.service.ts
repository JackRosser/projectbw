import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iGame } from '../models/i-game';
import { Observable } from 'rxjs';
import { iFavoriteGame } from '../models/i-favorite-game';

@Injectable({
  providedIn: 'root',
})
export class PrefgameService {
  private EP = environment.gamesFavUrl;

  constructor(private http: HttpClient) {}

  addFavoriteGame(userId: number, game: iGame): Observable<iFavoriteGame> {
    const favoriteGame: iFavoriteGame = { userId, game };
    return this.http.post<iFavoriteGame>(this.EP, favoriteGame);
  }

  removeFavoriteGame(userId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.EP}/${id}?userId=${userId}`);
  }

  getFavoritesByUser(userId: number): Observable<iFavoriteGame[]> {
    return this.http.get<iFavoriteGame[]>(`${this.EP}?userId=${userId}`);
  }
}
