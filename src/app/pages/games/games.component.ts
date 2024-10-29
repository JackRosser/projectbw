import { Component } from '@angular/core';
import { iGame } from '../../models/i-game';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent {

constructor(private gameSvc:GameService) {}

gamesList!: iGame[]

ngOnInit() {
this.gameSvc.game$.subscribe(list => {
  this.gamesList = list
})
}

}
