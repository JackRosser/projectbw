import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { iFavoriteUser } from '../../models/i-favorite-user';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  favorites: iFavoriteUser[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favoriteService.getFavoritesForCurrentUser().subscribe();
    this.favoriteService.favorites$.subscribe((favorites) => {
      this.favorites = favorites;
    });
  }
}
