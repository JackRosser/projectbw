import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/i-user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { iFavoriteUser } from '../../models/i-favorite-user';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
<<<<<<< HEAD
  arrUsers$ = new BehaviorSubject<iUser[]>([]); // Lista degli utenti osservabile
  currentIndex: number = 0; // Indice dell'utente corrente
  userId: number | null = null; // ID dell'utente loggato
  isFavorite: boolean = false; // Stato di "preferito" dell'utente corrente
  likeUsers: iUser[] = []; // Utenti aggiunti ai preferiti
  previousMatchedUsers$ = new BehaviorSubject<number[]>([]); // Lista di utenti già scartati osservabile
  noMoreUsers: boolean = false; // Flag per la fine della lista utenti
  userFavUrl = environment.userFavUrl; // URL dei preferiti
=======
  arrUsers: iUser[] = [];
allUsersList!: iUser[]


  currentIndex: number = 0;

  userId: number | null = null;
  isFavorite: boolean = false;
  //prova array
  likeUsers: iUser[] = [];
  previousMatchedUsers: number[] = [];
  noMoreUsers: boolean = false;

  private favoritesSubject = new BehaviorSubject<iFavoriteUser[]>([]);

  userFavUrl = environment.userFavUrl;
>>>>>>> 1e8a2b2caf3344d3cb3371813cf859f5df6d4dbc

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private favoriteSvc: FavoriteService
  ) {}

  ngOnInit(): void {
<<<<<<< HEAD
    // Ottieni dettagli dell'utente loggato
=======
   this.userSvc.allUser$.subscribe(list => {
    this.allUsersList = list

  })
>>>>>>> 1e8a2b2caf3344d3cb3371813cf859f5df6d4dbc
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
<<<<<<< HEAD
        this.updateArrUsers(filteredUsers);
=======
        console.log("INIZIO", this.arrUsers);

        // Salva l'elenco degli utenti aggiornato nel localStorage
        localStorage.setItem('arrUsers', JSON.stringify(this.arrUsers));
>>>>>>> 1e8a2b2caf3344d3cb3371813cf859f5df6d4dbc
        this.updateFavoriteStatus();
      });
    });
  }

  // Passa all'utente successivo
  nextUser() {
    const users = this.arrUsers$.value;
    if (users.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % users.length;
      this.updateFavoriteStatus();
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
            console.log('Utente aggiunto ai preferiti');
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
    console.log('Utenti piaciuti:', this.likeUsers);

    if(this.arrUsers.length === 0) {
      this.popolation();
    }
    console.log("ARRAY SPOPOLATO", this.arrUsers);
    console.log("ARRAY CLONE", this.allUsersList);

  }

<<<<<<< HEAD
  // Scarta l'utente corrente
=======

>>>>>>> 1e8a2b2caf3344d3cb3371813cf859f5df6d4dbc
  dislikeUser() {
    const userId = this.arrUsers$.value[this.currentIndex].id;
    this.addMatchedUser(userId);
    this.removeMatchedUser();
  }

<<<<<<< HEAD
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
=======
private popolation():void {
this.arrUsers = this.allUsersList
}


  private removeMatchedUser() {

    const removedUser = this.arrUsers.splice(this.currentIndex, 1)[0];
    if (removedUser) {
      this.previousMatchedUsers.push(removedUser.id);
    }
    if (this.arrUsers.length === 0) {
      this.currentIndex = 0;
    } else if (this.currentIndex >= this.arrUsers.length) {
       this.currentIndex = 0;
>>>>>>> 1e8a2b2caf3344d3cb3371813cf859f5df6d4dbc
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
}
