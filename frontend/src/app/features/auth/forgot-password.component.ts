import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './auth.new.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;
  submitted: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse email';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Call backend API to request password reset
    this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email: this.email }).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
        this.successMessage = 'Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}
