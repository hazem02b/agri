import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <!-- Left Side - Branding -->
        <div class="auth-branding">
          <div class="branding-content">
            <h1>🌾 AgroMarket</h1>
            <p class="tagline">La plateforme qui connecte les fermiers aux consommateurs</p>
            
            <div class="features-list">
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Produits 100% locaux et frais</span>
              </div>
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Livraison rapide à domicile</span>
              </div>
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Prix équitables garantis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="auth-form-container">
          <div class="auth-form-wrapper">
            <div class="form-header">
              <h2>Bon retour!</h2>
              <p>Connectez-vous pour accéder à votre compte</p>
            </div>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
              <div class="form-group">
                <label for="email">Adresse email</label>
                <div class="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="input-icon">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    [(ngModel)]="credentials.email"
                    required
                    email
                    placeholder="nom@exemple.com"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="label-row">
                  <label for="password">Mot de passe</label>
                  <a href="#" class="forgot-link">Mot de passe oublié?</a>
                </div>
                <div class="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="input-icon">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    [(ngModel)]="credentials.password"
                    required
                    minlength="6"
                    placeholder="Entrez votre mot de passe"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="remember-me">
                <label class="checkbox-label">
                  <input type="checkbox" name="remember">
                  <span>Se souvenir de moi</span>
                </label>
              </div>

              <div *ngIf="errorMessage" class="error-message">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary btn-full" [disabled]="!loginForm.valid || loading">
                <span *ngIf="!loading">Se connecter</span>
                <span *ngIf="loading" class="loading-spinner">
                  <svg class="spin" width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Connexion...
                </span>
              </button>
            </form>

            <div class="divider">
              <span>Ou continuer avec</span>
            </div>

            <div class="social-login">
              <button class="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button class="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div class="auth-footer">
              <p>Pas encore de compte? <a routerLink="/auth/signup" class="signup-link">Créer un compte</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-50);
      padding: 20px;
    }

    .auth-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 1000px;
      width: 100%;
      background: var(--background);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    /* Branding Side */
    .auth-branding {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      padding: 60px 40px;
      color: white;
      display: flex;
      align-items: center;
    }

    .branding-content h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      color: white;
    }

    .tagline {
      font-size: 1.125rem;
      margin-bottom: 48px;
      color: rgba(255, 255, 255, 0.9);
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .feature-item svg {
      flex-shrink: 0;
    }

    /* Form Side */
    .auth-form-container {
      padding: 60px 40px;
      display: flex;
      align-items: center;
    }

    .auth-form-wrapper {
      width: 100%;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-header h2 {
      font-size: 2rem;
      margin-bottom: 8px;
      color: var(--gray-900);
    }

    .form-header p {
      color: var(--text-secondary);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .forgot-link {
      font-size: 14px;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      pointer-events: none;
    }

    .form-input {
      padding-left: 44px;
    }

    .remember-me {
      margin: -8px 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .btn-full {
      width: 100%;
      margin-top: 8px;
      height: 48px;
      font-size: 16px;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .divider {
      margin: 24px 0;
      text-align: center;
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background: var(--border-color);
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .divider span {
      background: var(--background);
      padding: 0 12px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .social-login {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn-social {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      height: 48px;
      border: 1.5px solid var(--border-color);
      background: var(--background);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-social:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;
      color: var(--text-secondary);
    }

    .signup-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
    }

    .signup-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .auth-container {
        grid-template-columns: 1fr;
      }

      .auth-branding {
        padding: 40px 24px;
      }

      .auth-form-container {
        padding: 40px 24px;
      }

      .branding-content h1 {
        font-size: 2rem;
      }

      .form-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Redirect based on role
        if (response.role === 'FARMER') {
          this.router.navigate(['/farmer-dashboard']);
        } else {
          this.router.navigate(['/marketplace']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
