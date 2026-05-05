import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = 'admin@test.com';
  motDePasse = '123456';
  loading = false;
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login({
      email: this.email,
      motDePasse: this.motDePasse,
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      },
    });
  }
}