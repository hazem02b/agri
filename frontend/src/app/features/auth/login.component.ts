import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoginRequest } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './auth.component.css'
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  error = '';
  showPassword = false;
  userRole: 'BUYER' | 'FARMER' = 'BUYER';

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Wait for Google GIS script to load
    const tryInit = () => {
      if (typeof (window as any)['google'] !== 'undefined') {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleCallback(response.credential)
        });
        if (this.googleBtnContainer?.nativeElement) {
          google.accounts.id.renderButton(
            this.googleBtnContainer.nativeElement,
            { theme: 'outline', size: 'large', width: 360, text: 'signin_with', shape: 'rectangular', logo_alignment: 'center' }
          );
        }
      } else {
        setTimeout(tryInit, 300);
      }
    };
    tryInit();
  }

  handleGoogleCallback(idToken: string) {
    this.loading = true;
    this.error = '';
    this.authService.loginWithGoogle(idToken, this.userRole).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.success('Connexion Google réussie ! Bienvenue.');
        const destination = (response.role === 'FARMER') ? '/farmer-dashboard' : '/marketplace';
        setTimeout(() => { window.location.href = destination; }, 300);
      },
      error: () => {
        this.loading = false;
        this.error = 'Connexion Google échouée. Vérifiez votre Client ID Google ou réessayez.';
      }
    });
  }

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
        let destination = '/marketplace';
        if (response.role === 'FARMER') destination = '/farmer-dashboard';
        else if (response.role === 'BUYER' || response.role === 'CUSTOMER') destination = '/marketplace';
        setTimeout(() => { window.location.href = destination; }, 300);
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
