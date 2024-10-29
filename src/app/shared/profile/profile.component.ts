import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isFavoriteCollapsed = true;
  isChatCollapsed = true;

  toggleFavorite() {
    this.isFavoriteCollapsed = !this.isFavoriteCollapsed;
    if (!this.isFavoriteCollapsed) {
      this.isChatCollapsed = true; // Chiude il pannello Chat
    }
  }

  toggleChat() {
    this.isChatCollapsed = !this.isChatCollapsed;
    if (!this.isChatCollapsed) {
      this.isFavoriteCollapsed = true; // Chiude il pannello Lista Preferiti
    }
}
}
