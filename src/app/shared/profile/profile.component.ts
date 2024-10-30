import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PrefgameService } from '../../services/prefgame.service';
import { iGame } from '../../models/i-game';
import { AuthService } from '../../services/auth.service';
import { iFavoriteGame } from '../../models/i-favorite-game';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnChanges {
  isFavoriteCollapsed = true;
  isChatCollapsed = true;
  favoriteGames: iFavoriteGame[] = [];

  constructor(
    private favGameSvc: PrefgameService,
    private authSvc: AuthService
  ) {}

  toggleFavorite() {
    this.isFavoriteCollapsed = !this.isFavoriteCollapsed;
    if (!this.isFavoriteCollapsed) {
      this.isChatCollapsed = true; // Chiude il pannello Chat
      console.log('Sto caricando i preferiti');
      this.loadPrefGames();
    }
  }

  toggleChat() {
    this.isChatCollapsed = !this.isChatCollapsed;
    if (!this.isChatCollapsed) {
      this.isFavoriteCollapsed = true; // Chiude il pannello Lista Preferiti
      console.log('Sto caricando i preferiti');
      this.loadPrefGames();
    }
  }

  loadPrefGames() {
    const userId = this.authSvc.getUserId();
    if (userId === null) {
      console.log('userid nullo');
      return;
    }
    this.favGameSvc.getFavoritesByUser(userId).subscribe(
      (favorites) => {
        this.favoriteGames = favorites;
      },
      (error) => {
        console.error('Errore nel caricamento dei giochi preferiti:', error);
      }
    );
  }
  removeFavGame(favoriteGame: iFavoriteGame): void {
    console.log('Sono entrato nella funzione removeFavGame');

    const userId = this.authSvc.getUserId();
    if (userId === null) {
      console.log('ID utente nullo, impossibile rimuovere il gioco preferito.');
      return;
    }

    if (!favoriteGame) {
      console.log(
        'Il gioco non è presente nei preferiti, impossibile rimuovere.'
      );
      return;
    }
    if (!favoriteGame.id) {
      return;
    }
    this.favGameSvc.removeFavoriteGame(userId, favoriteGame.id).subscribe(
      () => {
        this.favoriteGames = this.favoriteGames.filter(
          (favGame) => favGame.id !== favoriteGame.id
        );
        console.log(`Gioco con ID ${favoriteGame.id} rimosso dai preferiti.`);
      },
      (error) => {
        console.error('Errore nella rimozione del gioco dai preferiti:', error);
      }
    );
  }

  @Input() profileOn!: boolean;
  appear: string =
    'transform: translateX(100vw); transition: transform; transition-duration: 300ms;';

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['profileOn'] &&
      changes['profileOn'].currentValue !== undefined
    ) {
      if (this.profileOn === true) {
        this.appear = 'transform: translateX(0); transition: transform 300ms; ';
        this.profileOn = false;
      } else {
        this.appear =
          'transform: translateX(100%); transition: transform 300ms;';
        this.profileOn = true;
      }
    }
  }
}
