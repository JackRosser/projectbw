import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { iUser } from '../../models/i-user';


import { PrefgameService } from '../../services/prefgame.service';
import { iGame } from '../../models/i-game';

import { iFavoriteGame } from '../../models/i-favorite-game';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isFavoriteCollapsed = true;
  isChatCollapsed = true;
  user!: iUser;
  favoriteGames: iFavoriteGame[] = [];

  constructor(private authSvc: AuthService,  private favGameSvc: PrefgameService,) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileOn'] && changes['profileOn'].currentValue !== undefined) {
      if (this.profileOn === true) {
        this.appear = 'transform: translateX(0); transition: transform 300ms; display: block;';
        this.profileOn = false;
      } else {
        this.appear = 'transform: translateX(100%); transition: transform 300ms; display: none;';
        this.profileOn = true;
      }
    }
  }

  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
      console.log(this.user);
    });
  }


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

  @Input() profileOn!: boolean;
  appear: string =
    'transform: translateX(100vw); transition: transform; transition-duration: 300ms; display: none';


    close(): void {
      if (this.profileOn === true) {
        this.appear = 'transform: translateX(0); transition: transform 300ms; display: block;';
        this.profileOn = false;
      } else {
        this.appear = 'transform: translateX(100%); transition: transform 300ms; display: none;';
        this.profileOn = true;
      }
      console.log("FUNZIONE CLOSE", this.profileOn);
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




}
