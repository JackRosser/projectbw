import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/i-user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  arrUsers: iUser[] = [];

  currentIndex: number = 0;

  constructor(private authSvc: AuthService, private userSvc: UserService) {}
  ngOnInit(): void {
    this.userSvc.getUsers().subscribe((user: iUser[]) => {
      this.arrUsers = user;
      console.log(this.arrUsers);
    });
  }

  nextUser() {
    if (this.currentIndex < this.arrUsers.length - 1) {
      this.currentIndex++;
      console.log(this.currentIndex);
    } else {
      this.currentIndex = 0; // Torna al primo utente se sei alla fine
    }
  }

  previousUser() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.arrUsers.length - 1; // Torna all'ultimo utente se sei all'inizio
    }
  }
}
