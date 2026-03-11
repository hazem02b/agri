import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './auth.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  error = '';
  showPassword = false;
  userRole: 'BUYER' | 'FARMER' = 'BUYER';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.success('Connexion réussie ! Bienvenue.');
        // Navigate based on user role
        if (response.role === 'FARMER') {
          this.router.navigate(['/farmer-dashboard']);
        } else if (response.role === 'BUYER') {
          this.router.navigate(['/buyer-dashboard']);
        } else {
          this.router.navigate(['/marketplace']);
        }
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        this.error = errorMsg;
        this.toastService.error(errorMsg);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
