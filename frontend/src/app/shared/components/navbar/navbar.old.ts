import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <!-- Logo -->
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#22C55E"/>
              <path d="M20 10C15 10 12 15 12 20C12 25 15 28 20 30C25 28 28 25 28 20C28 15 25 10 20 10Z" fill="white"/>
              <path d="M20 8L20 12M15 15L18 18M25 15L22 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="logo-text">AgroMarket</span>
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="navbar-links" [class.active]="mobileMenuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
          <a routerLink="/marketplace" routerLinkActive="active">Marketplace</a>
          <a *ngIf="currentUser?.role === 'FARMER'" routerLink="/farmer-dashboard" routerLinkActive="active">
            Mon Espace Fermier
          </a>
          <a *ngIf="isAuthenticated" routerLink="/orders" routerLinkActive="active">Mes Commandes</a>
        </div>

        <!-- Expandable Search -->
        <div class="search-wrapper" [class.expanded]="searchExpanded">
          <button class="search-trigger" (click)="toggleSearch()" *ngIf="!searchExpanded">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
          </button>
          <div class="search-input-wrapper" *ngIf="searchExpanded">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="search-icon">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input type="text" placeholder="Rechercher..." class="search-input" [(ngModel)]="searchQuery" />
            <button class="search-close" (click)="toggleSearch()">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- User Actions -->
        <div class="navbar-actions">
          <div *ngIf="!isAuthenticated" class="auth-buttons">
            <button routerLink="/auth/login" class="btn btn-ghost">Connexion</button>
            <button routerLink="/auth/signup" class="btn btn-primary">S'inscrire</button>
          </div>

          <div *ngIf="isAuthenticated" class="user-menu">
            <div class="cart-icon">
              🛒
              <span class="badge-count">0</span>
            </div>
            
            <div class="user-dropdown" (click)="toggleDropdown()">
              <div class="user-avatar">
                {{ currentUser?.firstName?.charAt(0) || 'U' }}
              </div>
              <span class="user-name">{{ currentUser?.firstName }}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              
              <!-- Dropdown Menu -->
              <div class="dropdown-menu" *ngIf="dropdownOpen">
                <a routerLink="/profile" class="dropdown-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  Mon Profil
                </a>
                <a routerLink="/orders" class="dropdown-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                  Mes Commandes
                </a>
                <div class="dropdown-divider"></div>
                <a (click)="logout()" class="dropdown-item logout">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
                  </svg>
                  Déconnexion
                </a>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
            <svg *ngIf="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg *ngIf="mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    /* Logo */
    .navbar-brand .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      transition: transform 0.2s;
    }

    .navbar-brand .logo:hover {
      transform: scale(1.05);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation Links */
    .navbar-links {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    .navbar-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      transition: color 0.2s;
      position: relative;
    }

    .navbar-links a:hover,
    .navbar-links a.active {
      color: var(--primary-color);
    }

    .navbar-links a.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary-color);
      border-radius: 2px;
    }

    /* Expandable Search */
    .search-wrapper {
      display: flex;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .search-wrapper.expanded {
      flex: 1;
      max-width: 400px;
    }

    .search-trigger {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--gray-100);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all 0.2s;
    }

    .search-trigger:hover {
      background: var(--primary-50);
      color: var(--primary-color);
      transform: scale(1.05);
    }

    .search-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .search-input-wrapper .search-icon {
      position: absolute;
      left: 16px;
      color: var(--text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 12px 48px 12px 48px;
      border: 1.5px solid var(--border-color);
      border-radius: 24px;
      font-size: 15px;
      background: var(--background);
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }

    .search-close {
      position: absolute;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all 0.2s;
    }

    .search-close:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    /* Actions */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .auth-buttons {
      display: flex;
      gap: 12px;
    }

    /* Cart */
    .cart-icon {
      position: relative;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .cart-icon:hover {
      background: var(--gray-100);
    }

    .badge-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--danger-color);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    /* User Dropdown */
    .user-dropdown {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: background 0.2s;
    }

    .user-dropdown:hover {
      background: var(--gray-100);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-xl);
      min-width: 200px;
      overflow: hidden;
      animation: fadeIn 0.2s ease;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-primary);
      text-decoration: none;
      transition: background 0.2s;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background: var(--gray-100);
    }

    .dropdown-item.logout {
      color: var(--danger-color);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
      margin: 4px 0;
    }

    /* Mobile Menu */
    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .navbar-links {
        display: none;
        position: absolute;
        top: 72px;
        left: 0;
        right: 0;
        background: var(--background);
        flex-direction: column;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        box-shadow: var(--shadow-lg);
      }

      .navbar-links.active {
        display: flex;
      }

      .navbar-links a.active::after {
        display: none;
      }

      .mobile-menu-toggle {
        display: block;
      }

      .user-name {
        display: none;
      }

      .auth-buttons {
        flex-direction: column;
        width: 100%;
      }

      .auth-buttons .btn {
        width: 100%;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  currentUser: User | null = null;
  UserRole = UserRole;
  dropdownOpen = false;
  mobileMenuOpen = false;
  searchExpanded = false;
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleSearch() {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.searchQuery = '';
    }
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
}
