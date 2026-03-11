import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductCategory } from '../../core/models/product.model';
import { fadeIn, scaleIn, staggerFadeIn } from '../../core/animations/animations';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  animations: [fadeIn, scaleIn, staggerFadeIn],
  template: `
    <div class="marketplace-page">
      <!-- Hero Banner -->
      <section class="marketplace-banner">
        <div class="container">
          <h1>Explorez notre Marketplace</h1>
          <p>Découvrez des produits frais directement des fermiers locaux</p>
        </div>
      </section>

      <!-- Main Content with Sidebar -->
      <section class="marketplace-content">
        <div class="container">
          <div class="content-wrapper">
            <!-- Sidebar Filters -->
            <aside class="sidebar">
              <div class="sidebar-section">
                <h3 class="sidebar-title">Catégories</h3>
                <div class="category-buttons">
                  <button 
                    class="category-btn" 
                    [class.active]="selectedCategory === ''"
                    (click)="selectCategory('')">
                    Toutes
                  </button>
                  <button 
                    *ngFor="let cat of categories" 
                    class="category-btn"
                    [class.active]="selectedCategory === cat"
                    (click)="selectCategory(cat)">
                    {{ getCategoryLabel(cat) }}
                  </button>
                </div>
              </div>

              <div class="sidebar-section">
                <h3 class="sidebar-title">Prix</h3>
                <div class="price-filter">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    [(ngModel)]="maxPrice"
                    (ngModelChange)="filterProducts()"
                    class="price-slider"
                  />
                  <div class="price-range">
                    <span>0€</span>
                    <span class="price-max">{{ maxPrice }}€</span>
                  </div>
                </div>
              </div>

              <div class="sidebar-section">
                <h3 class="sidebar-title">Filtres</h3>
                <div class="filter-badges">
                  <label class="badge-filter" [class.active]="organicOnly">
                    <input type="checkbox" [(ngModel)]="organicOnly" (ngModelChange)="filterProducts()"/>
                    <span class="badge-icon">🌱</span>
                    <span>Bio</span>
                  </label>
                  <label class="badge-filter" [class.active]="localOnly">
                    <input type="checkbox" [(ngModel)]="localOnly" (ngModelChange)="filterProducts()"/>
                    <span class="badge-icon">📍</span>
                    <span>Local</span>
                  </label>
                  <label class="badge-filter" [class.active]="newOnly">
                    <input type="checkbox" [(ngModel)]="newOnly" (ngModelChange)="filterProducts()"/>
                    <span class="badge-icon">✨</span>
                    <span>Nouveau</span>
                  </label>
                </div>
              </div>
            </aside>

            <!-- Main Products Area -->
            <main class="products-main">
              <!-- Search & View Toggle -->
              <div class="products-header">
                <div class="search-box">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="search-icon">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="onSearch()"
                    placeholder="Rechercher des produits..."
                    class="search-input"
                  />
                </div>

                <div class="view-controls">
                  <span class="results-count">{{ filteredProducts.length }} produits</span>
                  <div class="view-toggle">
                    <button 
                      class="view-btn" 
                      [class.active]="viewMode === 'grid'"
                      (click)="viewMode = 'grid'"
                      title="Vue grille">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z"/>
                      </svg>
                    </button>
                    <button 
                      class="view-btn" 
                      [class.active]="viewMode === 'list'"
                      (click)="viewMode = 'list'"
                      title="Vue liste">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div *ngIf="loading" class="loading">
                <svg class="spin" width="40" height="40" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p>Chargement des produits...</p>
              </div>

              <div *ngIf="!loading && filteredProducts.length === 0" class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" stroke-width="2"/>
                  <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres ou critères de recherche</p>
              </div>

              <!-- Grid View -->
              <div class="products-grid" *ngIf="!loading && filteredProducts.length > 0 && viewMode === 'grid'" @staggerFadeIn>
                <div *ngFor="let product of filteredProducts" class="product-card hover-lift" @fadeIn>
                  <div class="product-image">
                    <img [src]="product.images[0] || 'https://via.placeholder.com/400x300?text=Produit'" [alt]="product.name">
                    <div class="product-badges">
                      <span *ngIf="product.isOrganic" class="badge badge-organic">🌱 Bio</span>
                      <span class="badge badge-new">✨ Nouveau</span>
                    </div>
                    <button class="wishlist-btn">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="btn-add-cart-hover" (click)="addToCart(product)">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
                      </svg>
                      Ajouter au panier
                    </button>
                  </div>
                  <div class="product-body">
                    <div class="product-meta-top">
                      <span class="product-category">{{ getCategoryLabel(product.category) }}</span>
                      <div class="product-rating">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        {{ product.rating.toFixed(1) }}
                      </div>
                    </div>
                    <h3 class="product-title">{{ product.name }}</h3>
                    <p class="product-description">{{ product.description }}</p>
                    <div class="product-footer">
                      <div class="product-price">
                        <span class="price-amount">{{ product.price }}€</span>
                        <span class="price-unit">/ {{ product.unit }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- List View -->
              <div class="products-list" *ngIf="!loading && filteredProducts.length > 0 && viewMode === 'list'">
                <div *ngFor="let product of filteredProducts" class="product-card-list hover-lift">
                  <div class="product-image-list">
                    <img [src]="product.images[0] || 'https://via.placeholder.com/200x200?text=Produit'" [alt]="product.name">
                    <div class="product-badges-list">
                      <span *ngIf="product.isOrganic" class="badge badge-organic">🌱 Bio</span>
                    </div>
                  </div>
                  <div class="product-body-list">
                    <div class="product-header-list">
                      <div>
                        <span class="product-category">{{ getCategoryLabel(product.category) }}</span>
                        <h3 class="product-title-list">{{ product.name }}</h3>
                      </div>
                      <div class="product-rating">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        {{ product.rating.toFixed(1) }}
                      </div>
                    </div>
                    <p class="product-description-list">{{ product.description }}</p>
                    <div class="product-footer-list">
                      <div class="product-price">
                        <span class="price-amount">{{ product.price }}€</span>
                        <span class="price-unit">/ {{ product.unit }}</span>
                      </div>
                      <button class="btn btn-primary" (click)="addToCart(product)">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
                        </svg>
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Banner */
    .marketplace-banner {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 60px 0;
      text-align: center;
    }

    .marketplace-banner h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      color: white;
    }

    .marketplace-banner p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
    }

    /* Main Content Layout */
    .marketplace-content {
      padding: 40px 0;
      min-height: 80vh;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .sidebar-section {
      margin-bottom: 32px;
    }

    .sidebar-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 16px;
    }

    .category-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-btn {
      padding: 12px 20px;
      border: 1.5px solid var(--border-color);
      background: var(--background);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      color: var(--text-primary);
      text-align: left;
    }

    .category-btn:hover {
      background: var(--primary-50);
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateX(4px);
    }

    .category-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }

    /* Price Filter */
    .price-filter {
      padding: 12px 0;
    }

    .price-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--gray-200);
      outline: none;
      -webkit-appearance: none;
    }

    .price-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      box-shadow: var(--shadow-md);
    }

    .price-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      border: none;
    }

    .price-range {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .price-max {
      font-weight: 700;
      color: var(--primary-color);
    }

    /* Badge Filters */
    .filter-badges {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .badge-filter {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1.5px solid var(--border-color);
      background: var(--background);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.2s;
    }

    .badge-filter:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    .badge-filter.active {
      background: var(--primary-50);
      border-color: var(--primary-color);
    }

    .badge-filter input[type="checkbox"] {
      width: auto;
      margin: 0;
    }

    .badge-icon {
      font-size: 20px;
    }

    /* Products Header */
    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 1.5px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      font-size: 16px;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
      outline: none;
    }

    .view-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .results-count {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 14px;
    }

    .view-toggle {
      display: flex;
      border: 1.5px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
    }

    .view-btn {
      padding: 8px 12px;
      border: none;
      background: var(--background);
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-secondary);
    }

    .view-btn:hover {
      background: var(--gray-50);
      color: var(--primary-color);
    }

    .view-btn.active {
      background: var(--primary-color);
      color: white;
    }

    .view-btn:not(:last-child) {
      border-right: 1.5px solid var(--border-color);
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    /* Product Card (Grid View) */
    .product-card {
      background: var(--background);
      border-radius: var(--border-radius);
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      position: relative;
    }

    .product-image {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: var(--gray-100);
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.1);
    }

    .product-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    .badge-organic {
      background: rgba(16, 185, 129, 0.9);
      color: white;
    }

    .badge-new {
      background: rgba(251, 191, 36, 0.9);
      color: white;
    }

    .wishlist-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-md);
      transition: all 0.2s;
      color: var(--text-secondary);
      opacity: 0;
    }

    .product-card:hover .wishlist-btn {
      opacity: 1;
    }

    .wishlist-btn:hover {
      background: var(--danger-color);
      color: white;
      transform: scale(1.1);
    }

    /* Add to Cart Button (Appears on Hover) */
    .btn-add-cart-hover {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      padding: 12px 24px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--border-radius-sm);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
    }

    .product-card:hover .btn-add-cart-hover {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: all;
    }

    .btn-add-cart-hover:hover {
      background: var(--primary-dark);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    }

    .product-body {
      padding: 20px;
    }

    .product-meta-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .product-category {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #F59E0B;
      font-weight: 600;
      font-size: 14px;
    }

    .product-title {
      font-size: 1.125rem;
      margin-bottom: 8px;
      color: var(--gray-900);
      font-weight: 700;
      line-height: 1.4;
    }

    .product-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 16px;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .product-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .price-amount {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .price-unit {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }

    /* Products List (List View) */
    .products-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .product-card-list {
      display: flex;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .product-image-list {
      position: relative;
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      background: var(--gray-100);
    }

    .product-image-list img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-card-list:hover .product-image-list img {
      transform: scale(1.05);
    }

    .product-badges-list {
      position: absolute;
      top: 12px;
      left: 12px;
    }

    .product-body-list {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .product-header-list {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .product-title-list {
      font-size: 1.5rem;
      margin-top: 8px;
      margin-bottom: 0;
      color: var(--gray-900);
      font-weight: 700;
    }

    .product-description-list {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: auto;
      line-height: 1.6;
    }

    .product-footer-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
      margin-top: 16px;
    }

    /* Loading & Empty States */
    .loading, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
      color: var(--text-secondary);
    }

    .loading svg {
      margin-bottom: 16px;
      color: var(--primary-color);
    }

    .empty-state svg {
      margin-bottom: 24px;
      color: var(--text-tertiary);
      stroke-width: 1.5;
    }

    .empty-state h3 {
      margin-bottom: 8px;
      color: var(--gray-900);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 240px 1fr;
        gap: 24px;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .marketplace-banner h1 {
        font-size: 2rem;
      }

      .content-wrapper {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }

      .product-card-list {
        flex-direction: column;
      }

      .product-image-list {
        width: 100%;
        height: 220px;
      }

      .products-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: 100%;
      }

      .view-controls {
        justify-content: space-between;
      }
    }
  `]
})
export class MarketplaceComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(ProductCategory);
  selectedCategory = '';
  searchTerm = '';
  organicOnly = false;
  localOnly = false;
  newOnly = false;
  maxPrice = 100;
  viewMode: 'grid' | 'list' = 'grid';
  loading = true;
  isAuthenticated = false;
  currentUser: any;
  
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    });
  }
  
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesOrganic = !this.organicOnly || product.isOrganic;
      const matchesPrice = product.price <= this.maxPrice;
      
      return matchesCategory && matchesSearch && matchesOrganic && matchesPrice;
    });
  }
  
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }
  
  onCategoryChange(): void {
    this.filterProducts();
  }
  
  onSearch(): void {
    this.filterProducts();
  }
  
  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'VEGETABLES': 'Légumes',
      'FRUITS': 'Fruits',
      'GRAINS': 'Céréales',
      'DAIRY': 'Produits laitiers',
      'MEAT': 'Viande',
      'POULTRY': 'Volaille',
      'EGGS': 'Œufs',
      'HONEY': 'Miel',
      'HERBS': 'Herbes',
      'FLOWERS': 'Fleurs',
      'SEEDS': 'Graines',
      'NUTS': 'Noix',
      'OTHER': 'Autre'
    };
    return labels[category] || category;
  }
  
  addToCart(product: Product): void {
    console.log('Adding to cart:', product);
    // TODO: Implement cart functionality
  }
}
