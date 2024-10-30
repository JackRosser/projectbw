import { Component, OnInit } from '@angular/core';
import { iGame } from '../../models/i-game';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  searchQuery: string = '';
  gamesList: iGame[] = [];
  filteredGamesList: iGame[] = [];

  constructor(private gameSvc: GameService) {}

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
}
