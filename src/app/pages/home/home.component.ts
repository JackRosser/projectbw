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

  userId: number | null = null;

  constructor(private authSvc: AuthService, private userSvc: UserService) {}
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
    });
  }

  nextUser() {
    if (this.currentIndex < this.arrUsers.length - 1) {
      this.currentIndex++;
      console.log(this.currentIndex);
    } else {
      this.currentIndex = 0;
    }
  }

  previousUser() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.arrUsers.length - 1;
    }
  }
}
