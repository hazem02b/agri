import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './auth.component.css'
})
export class SignupComponent {
  // Form fields
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  userType: 'BUYER' | 'FARMER' = 'BUYER';
  acceptTerms = false;
  
  // UI State
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  currentStep = 1;

  // Farmer specific fields
  farmName = '';
  farmLocation = '';
  farmDescription = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.validateStep1()) return;
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateStep1(): boolean {
    if (!this.firstName || !this.lastName || !this.email) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return false;
    }
    if (!this.isValidEmail(this.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      return false;
    }
    this.error = '';
    return true;
  }

  validateStep2(): boolean {
    if (!this.password || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return false;
    }
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return false;
    }
    if (!this.acceptTerms) {
      this.error = 'Vous devez accepter les conditions d\'utilisation';
      return false;
    }
    if (this.userType === 'FARMER' && !this.farmName) {
      this.error = 'Veuillez renseigner le nom de votre ferme';
      return false;
    }
    this.error = '';
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    if (!this.validateStep2()) return;

    this.loading = true;
    this.error = '';

    const signupData: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.userType === 'BUYER' ? 'CUSTOMER' : this.userType
    };

    if (this.userType === 'FARMER') {
      signupData.farmName = this.farmName;
      signupData.farmDescription = this.farmDescription;
    }

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.success('Inscription réussie ! Bienvenue sur la plateforme.');
        // Auto-login after signup
        const credentials: LoginRequest = {
          email: this.email,
          password: this.password
        };
        this.authService.login(credentials).subscribe({
          next: () => {
            if (this.userType === 'FARMER') {
              this.router.navigate(['/farmer-dashboard']);
            } else if (this.userType === 'BUYER') {
              this.router.navigate(['/buyer-dashboard']);
            } else {
              this.router.navigate(['/marketplace']);
            }
          }
        });
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        this.error = errorMsg;
        this.toastService.error(errorMsg);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
