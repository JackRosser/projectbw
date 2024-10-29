import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iGame } from '../models/i-game';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http:HttpClient) {
    this.getAllGames()
}

private gamesList = new BehaviorSubject<iGame[]>([])
game$ = this.gamesList.asObservable()

private getAllGames():void {
  this.http.get<iGame[]>(environment.gamesUrl).subscribe(gameslist => {
    this.gamesList.next(gameslist)
  })
}


}
