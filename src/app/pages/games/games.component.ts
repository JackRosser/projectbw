import { Component, OnInit } from '@angular/core';
import { iGame } from '../../models/i-game';
import { GameService } from '../../services/game.service';
import { PrefgameService } from '../../services/prefgame.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  searchQuery: string = '';
  gamesList: iGame[] = [];
  filteredGamesList: iGame[] = [];

  constructor(
    private gameSvc: GameService,
    private prefgameSvc: PrefgameService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.gameSvc.game$.subscribe((list: iGame[]) => {
      this.gamesList = list;
      this.filteredGamesList = list;
    });
  }

  filterGames(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredGamesList = this.gamesList.filter(
      (game) =>
        game.title.toLowerCase().includes(query) ||
        game.genere.toLowerCase().includes(query)
    );
  }

  addGameToFavorites(game: iGame) {
    const userId = this.authSvc.getUserId();
    if (userId === null) {
      console.log('userid nullo');
      return;
    }
    this.prefgameSvc.getFavoritesByUser(userId).subscribe((favorites) => {
      const gameExists = favorites.some((fav) => fav.game.id === game.id);
      if (gameExists) {
        console.log(`${game.title} già nei preferiti.`);
        return;
      }
      this.prefgameSvc.addFavoriteGame(userId, game).subscribe(
        () => console.log(`${game.title} aggiunto ai preferiti.`),
        (error) =>
          console.error("Errore durante l'aggiunta ai preferiti:", error)
      );
    });
  }
}
