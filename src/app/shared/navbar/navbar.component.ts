import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  isLoggedIn$: Observable<boolean>;


  isMenuOpen = false;
  isSmallScreen = false;


  profileOn: boolean = false;

  constructor(private authService: AuthService) {

    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.checkScreenSize();
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }


  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;

    if (!this.isSmallScreen) {
      this.isMenuOpen = false;
    }
  }


  profileAppear(): void {
    this.profileOn = !this.profileOn;
  }


  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.profileOn = false;
  }
}
