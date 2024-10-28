import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { iUser } from '../../models/i-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  datiForm: Partial<iUser> = {};
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nickname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.datiForm = this.registerForm.value;
      this.authSvc.register(this.datiForm).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
          console.log(this.datiForm);
        },
      });
    }
  }
}
