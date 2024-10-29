import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // Aggiungi `isLoggedIn$` come Observable che si abbona a `isLoggedIn$` di AuthService

  isLoggedIn$: Observable<boolean>;


  constructor(private authService: AuthService) {
    // Assegna `isLoggedIn$` dal servizio all'osservabile locale
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }



profileOn:boolean = false

profileAppear():void {
this.profileOn = !this.profileOn
}


  logout() {
    this.authService.logout();
  }


}


