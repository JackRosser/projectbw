import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { iUser } from '../../models/i-user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isFavoriteCollapsed = true;
  isChatCollapsed = true;
  user!: iUser;
  constructor(private authSvc: AuthService) {}

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
    }
  }

  toggleChat() {
    this.isChatCollapsed = !this.isChatCollapsed;
    if (!this.isChatCollapsed) {
      this.isFavoriteCollapsed = true; // Chiude il pannello Lista Preferiti
    }
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
