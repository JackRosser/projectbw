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

  currentIndex: number = 0;

  userId: number | null = null;
  isFavorite: boolean = false;

  private favoritesSubject = new BehaviorSubject<iFavoriteUser[]>([]);

  userFavUrl = environment.userFavUrl;

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private favoriteSvc: FavoriteService
  ) {}
  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.userSvc.getUsers().subscribe((user: iUser[]) => {
      if (this.userId !== null) {
        this.arrUsers = user.filter((u) => u.id !== this.userId);
      } else {
        this.arrUsers = user;
      }
      this.updateFavoriteStatus();
    });
  }

  nextUser() {
    if (this.currentIndex < this.arrUsers.length - 1) {
      this.currentIndex++;
      console.log(this.currentIndex);
    } else {
      this.currentIndex = 0;
    }
    this.updateFavoriteStatus();
  }

  previousUser() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.arrUsers.length - 1;
    }
    this.updateFavoriteStatus;
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
          return;
        }
        this.favoriteSvc.addFavorite(favoriteUser).subscribe(
          () => {
            this.isFavorite = true;
            console.log('Utente aggiunto ai preferiti');
          },
          (error) => {
            console.error("Errore durante l'aggiunta ai preferiti:", error);
          }
        );
      },
      (error) => {
        console.error('Errore nel recupero dei preferiti:', error);
      }
    );
  }

  private updateFavoriteStatus() {
    const user = this.arrUsers[this.currentIndex];
    this.favoriteSvc.isFavorite(user.id).subscribe((isFav) => {
      this.isFavorite = isFav;
    });
  }
}
