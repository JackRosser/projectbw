import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/i-user';
import { iFavoriteUser } from '../../models/i-favorite-user';
import { iFavoriteGame } from '../../models/i-favorite-game';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FavoriteService } from '../../services/favorite.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  arrUsers$ = new BehaviorSubject<iUser[]>([]); // Lista degli utenti osservabile
  currentIndex: number = 0; // Indice dell'utente corrente
  userId: number | null = null; // ID dell'utente loggato
  isFavorite: boolean = false; // Stato di "preferito" dell'utente corrente
  likeUsers: iUser[] = []; // Utenti aggiunti ai preferiti
  previousMatchedUsers$ = new BehaviorSubject<number[]>([]); // Lista di utenti già scartati osservabile
  noMoreUsers: boolean = false; // Flag per la fine della lista utenti
  favoriteGames: iFavoriteGame[] = []; // Giochi preferiti dell'utente corrente

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private favoriteSvc: FavoriteService
  ) {}

  ngOnInit(): void {
    // Ottieni dettagli dell'utente loggato
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.loadUsers(); // Carica utenti se loggato
      } else {
        // Rimuovi dal localStorage se nessun utente è loggato
        localStorage.removeItem('arrUsers');
        localStorage.removeItem('matchedUsers');
      }
    });

    // Carica utenti e match precedenti dal localStorage
    const storedUsers = localStorage.getItem('arrUsers');
    const storedMatchedUsers = localStorage.getItem('matchedUsers');
    if (storedUsers) {
      this.arrUsers$.next(JSON.parse(storedUsers));
    }
    if (storedMatchedUsers) {
      this.previousMatchedUsers$.next(JSON.parse(storedMatchedUsers));
    }
  }

  // Carica gli utenti e filtra in base a preferiti e match precedenti
  loadUsers() {
    this.favoriteSvc.getFavoritesForCurrentUser().subscribe((favorites) => {
      this.favoriteSvc.updateFavoritesInStorage(favorites);
      const previousMatchedIds = favorites.map((fav) => fav.user.id);
      this.userSvc.getUsers().subscribe((users: iUser[]) => {
        const filteredUsers = users.filter(
          (u) => u.id !== this.userId && !previousMatchedIds.includes(u.id)
        );
        this.updateArrUsers(filteredUsers);
        this.updateFavoriteStatus();
        this.loadFavoriteGamesForCurrentUser(); // Carica i giochi preferiti dell'utente iniziale
      });
    });
  }

  // Carica i giochi preferiti dell'utente corrente
  loadFavoriteGamesForCurrentUser() {
    const currentUser = this.arrUsers$.value[this.currentIndex];
    if (currentUser) {
      this.favoriteSvc.getFavoriteGamesForUser(currentUser.id).subscribe(
        (favoriteGames) => {
          this.favoriteGames = favoriteGames;
        },
        (error) => {
          console.error("Errore nel caricamento dei giochi preferiti dell'utente:", error);
        }
      );
    }
  }

  // Passa all'utente successivo e aggiorna i giochi preferiti
  nextUser() {
    const users = this.arrUsers$.value;
    if (users.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % users.length;
      this.updateFavoriteStatus();
      this.loadFavoriteGamesForCurrentUser(); // Aggiorna i giochi preferiti dell'utente corrente
    } else {
      this.currentIndex = 0;
    }
  }

  // Aggiunge un utente ai preferiti
  addToFavorites() {
    const users = this.arrUsers$.value;
    if (this.userId === null || !users[this.currentIndex]?.nickname) {
      console.error('Qualcosa è andato storto');
      return;
    }
    const addedUser = users[this.currentIndex];
    const favoriteUser: iFavoriteUser = {
      userId: this.userId,
      user: addedUser,
    };
    this.favoriteSvc.getFavoritesForCurrentUser().subscribe(
      (favorites) => {
        const isAlreadyFavorite = favorites.some(
          (fav) => fav.user.email === addedUser.email && fav.userId === this.userId
        );
        if (isAlreadyFavorite) {
          console.log("L'utente è già nei preferiti per questo userId");
          this.removeMatchedUser();
          return;
        }
        this.favoriteSvc.addFavorite(favoriteUser).subscribe(
          () => {
            this.isFavorite = true;
            this.likeUsers.push(addedUser);
            this.addMatchedUser(addedUser.id);
            this.removeMatchedUser();
          },
          (error) => {
            console.error("Errore durante l'aggiunta ai preferiti:", error);
            this.removeMatchedUser();
          }
        );
      },
      (error) => {
        console.error('Errore nel recupero dei preferiti:', error);
        this.removeMatchedUser();
      }
    );
  }

  // Aggiorna lo stato di preferito
  private updateFavoriteStatus() {
    const users = this.arrUsers$.value;
    if (users.length > 0) {
      const user = users[this.currentIndex];
      this.favoriteSvc.isFavorite(user.id).subscribe((isFav) => {
        this.isFavorite = isFav;
      });
    }
  }

  // Aggiunge l'utente corrente ai preferiti
  likeUser() {
    this.addToFavorites();
  }

  // Scarta l'utente corrente
  dislikeUser() {
    const userId = this.arrUsers$.value[this.currentIndex].id;
    this.addMatchedUser(userId);
    this.removeMatchedUser();
  }

  // Rimuove l'utente corrente e passa al successivo
  private removeMatchedUser() {
    const updatedUsers = [...this.arrUsers$.value];
    updatedUsers.splice(this.currentIndex, 1);
    this.updateArrUsers(updatedUsers);

    if (updatedUsers.length === 0) {
      this.currentIndex = 0;
      this.noMoreUsers = true;
    } else if (this.currentIndex >= updatedUsers.length) {
      this.currentIndex = 0;
    }
    this.nextUser();
  }

  // Aggiorna l'array degli utenti nel BehaviorSubject e nel localStorage
  private updateArrUsers(newUsers: iUser[]) {
    this.arrUsers$.next(newUsers);
    localStorage.setItem('arrUsers', JSON.stringify(newUsers));
  }

  // Aggiunge un ID utente all'elenco dei match precedenti
  private addMatchedUser(userId: number) {
    const updatedMatchedUsers = [...this.previousMatchedUsers$.value, userId];
    this.previousMatchedUsers$.next(updatedMatchedUsers);
    localStorage.setItem('matchedUsers', JSON.stringify(updatedMatchedUsers));
  }

  mainContentVisible = false;
  isSloganVisible = true;

  showMainContent() {
    this.isSloganVisible = false;
    this.mainContentVisible = true;
  }
}
