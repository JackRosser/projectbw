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
      nickname: ['', [Validators.required, Validators.minLength(4)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
