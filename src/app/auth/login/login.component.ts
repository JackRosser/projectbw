import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { iLogin } from '../../models/i-login';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formData: iLogin = {
    email: '',
    password: '',
  };

  errorMessage: string | null = null;

  constructor(private authSvc: AuthService, private router: Router) {}
  ngOnInit(): void {}

  login(form: NgForm) {
    this.formData = form.value;
    this.authSvc.login(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('login fallito', err);
        this.errorMessage = 'verifica dati';
      },
      complete: () => {
        console.log('login completato');
      },
    });
  }
}
