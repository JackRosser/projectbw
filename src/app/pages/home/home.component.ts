import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/i-user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { iFavoriteUser } from '../../models/i-favorite-user';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
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

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private favoriteSvc: FavoriteService
  ) {}
  ngOnInit(): void {
   this.userSvc.allUser$.subscribe(list => {
    this.allUsersList = list

  })
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.loadUsers();
      } else {
        // Se nessun utente è loggato, cancella il localStorage
        localStorage.removeItem('arrUsers');
        localStorage.removeItem('matchedUsers');
      }
    });

    // Se l'utente già esiste
    const storedUsers = localStorage.getItem('arrUsers');
    const storedMatchedUsers = localStorage.getItem('matchedUsers');
    if (storedUsers) {
      this.arrUsers = JSON.parse(storedUsers);
    }
    if (storedMatchedUsers) {
      this.previousMatchedUsers = JSON.parse(storedMatchedUsers);
    }
  }

  loadUsers() {
    this.favoriteSvc.getFavoritesForCurrentUser().subscribe((favorites) => {
      this.favoriteSvc.updateFavoritesInStorage(favorites);
      const previousMatchedUsers = favorites.map((fav) => fav.user.id);
      this.userSvc.getUsers().subscribe((users: iUser[]) => {
        this.arrUsers = users.filter((u) => u.id !== this.userId);
        // Filtra gli utenti che sono già stati matchati
        this.arrUsers = this.arrUsers.filter(
          (user) => !previousMatchedUsers.includes(user.id)
        );
        console.log("INIZIO", this.arrUsers);

        // Salva l'elenco degli utenti aggiornato nel localStorage
        localStorage.setItem('arrUsers', JSON.stringify(this.arrUsers));
        this.updateFavoriteStatus();
      });
    });
  }

  nextUser() {
    if (this.arrUsers.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.arrUsers.length;
      this.updateFavoriteStatus();
    } else {
      this.currentIndex = 0;
    }
  }

  addToFavorites() {
    if (
      this.userId === null ||
      this.arrUsers[this.currentIndex].nickname === null
    ) {
      console.error('Qualcosa è andato storto');
      return;
    }
    const addedUser = this.arrUsers[this.currentIndex];
    const favoriteUser: iFavoriteUser = {
      userId: this.userId,
      user: addedUser,
    };
    this.favoriteSvc.getFavoritesForCurrentUser().subscribe(
      (favorites) => {
        const isAlreadyFavorite = favorites.some(
          (fav) =>
            fav.user.email === addedUser.email && fav.userId === this.userId
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
            // Aggiungi l'utente ai matchedUsers
            this.likeUsers.push(addedUser);
            this.previousMatchedUsers.push(addedUser.id);
            localStorage.setItem(
              'matchedUsers',
              JSON.stringify(this.previousMatchedUsers)
            );
            this.removeMatchedUser();
          },
          (error) => {
            console.error("Errore durante l'aggiunta ai preferiti:", error);
            this.removeMatchedUser(); // Assicurati di rimuovere l'utente anche se c'è un errore
          }
        );
      },
      (error) => {
        console.error('Errore nel recupero dei preferiti:', error);
        this.removeMatchedUser(); // Assicurati di rimuovere l'utente anche se c'è un errore
      }
    );
  }

  private updateFavoriteStatus() {
    if (this.arrUsers.length > 0) {
      const user = this.arrUsers[this.currentIndex];
      this.favoriteSvc.isFavorite(user.id).subscribe((isFav) => {
        this.isFavorite = isFav;
      });
    }
  }

  likeUser() {
    this.addToFavorites();
    console.log('Utenti piaciuti:', this.likeUsers);

    if(this.arrUsers.length === 0) {
      this.popolation();
    }
    console.log("ARRAY SPOPOLATO", this.arrUsers);
    console.log("ARRAY CLONE", this.allUsersList);

  }


  dislikeUser() {
    this.previousMatchedUsers.push(this.arrUsers[this.currentIndex].id);
    this.removeMatchedUser();
  }

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
    }
    localStorage.setItem('arrUsers', JSON.stringify(this.arrUsers));
    localStorage.setItem(
      'matchedUsers',
      JSON.stringify(this.previousMatchedUsers)
    );
    this.nextUser();
  }
}
