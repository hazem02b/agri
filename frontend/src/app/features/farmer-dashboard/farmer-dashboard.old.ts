import {Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { FarmerService } from '../../core/services/farmer.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <div class="container">
          <div class="header-content">
            <div>
              <h1>Tableau de Bord Fermier</h1>
              <p>Gérez vos produits et suivez vos performances</p>
            </div>
            <div class="header-actions">
              <button routerLink="/farmer-dashboard/add-product" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                </svg>
                Ajouter un Produit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon products-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Total Produits</div>
                <div class="stat-value">{{ myProducts.length }}</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon stock-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">En Stock</div>
                <div class="stat-value">{{ productsInStock }}</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon rating-icon">
                <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Note Moyenne</div>
                <div class="stat-value">{{ averageRating.toFixed(1) }}</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon revenue-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">Revenus (estimés)</div>
                <div class="stat-value">{{ totalRevenue }}€</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <h2>Mes Produits</h2>
            <div class="view-toggle">
              <button class="toggle-btn active">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="loading">
            <svg class="spin" width="40" height="40" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <p>Chargement de vos produits...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && myProducts.length === 0" class="empty-state">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h3>Aucun produit pour le moment</h3>
            <p>Commencez par ajouter votre premier produit pour le rendre visible aux acheteurs</p>
            <button routerLink="/farmer-dashboard/add-product" class="btn btn-primary btn-lg">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Ajouter mon Premier Produit
            </button>
          </div>

          <!-- Products Table -->
          <div *ngIf="!loading && myProducts.length > 0" class="products-table">
            <div class="table-header">
              <div class="col-product">Produit</div>
              <div class="col-category">Catégorie</div>
              <div class="col-price">Prix</div>
              <div class="col-stock">Stock</div>
              <div class="col-rating">Note</div>
              <div class="col-actions">Actions</div>
            </div>

            <div class="table-body">
              <div *ngFor="let product of myProducts" class="table-row">
                <div class="col-product product-cell">
                  <div class="product-image-small">
                    <img [src]="product.images[0] || 'https://via.placeholder.com/100'" [alt]="product.name">
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ product.name }}</div>
                    <span *ngIf="product.isOrganic" class="organic-tag">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Bio
                    </span>
                  </div>
                </div>

                <div class="col-category">
                  <span class="category-badge">{{ getCategoryLabel(product.category) }}</span>
                </div>

                <div class="col-price">
                  <span class="price">{{ product.price }}€</span> / {{ product.unit }}
                </div>

                <div class="col-stock">
                  <span class="stock-badge" [class.low]="product.stock < 10" [class.out]="product.stock === 0">
                    {{ product.stock }} unités
                  </span>
                </div>

                <div class="col-rating">
                  <div class="rating-display">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ product.rating.toFixed(1) }}
                    <span class="reviews-count">({{ product.totalReviews }})</span>
                  </div>
                </div>

                <div class="col-actions">
                  <button class="action-btn edit-btn" title="Modifier">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button class="action-btn view-btn" title="Voir">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" title="Supprimer">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Dashboard Header */
    .dashboard-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 48px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      color: white;
    }

    .dashboard-header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
    }

    /* Stats Section */
    .stats-section {
      padding: 48px 0;
      background: var(--gray-50);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: var(--background);
      padding: 28px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .products-icon {
      background: #DBEAFE;
      color: #1D4ED8;
    }

    .stock-icon {
      background: #D1FAE5;
      color: #059669;
    }

    .rating-icon {
      background: #FEF3C7;
      color: #D97706;
    }

    .revenue-icon {
      background: #E0E7FF;
      color: #6366F1;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
    }

    /* Products Section */
    .products-section {
      padding: 48px 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .section-header h2 {
      font-size: 1.875rem;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .toggle-btn {
      padding: 10px;
      background: var(--gray-100);
      border: none;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-secondary);
    }

    .toggle-btn.active {
      background: var(--primary-color);
      color: white;
    }

    /* Products Table */
    .products-table {
      background: var(--background);
      border-radius: var(--border-radius);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .table-header, .table-row {
      display: grid;
      grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 1.2fr;
      gap: 16px;
      padding: 16px 20px;
      align-items: center;
    }

    .table-header {
      background: var(--gray-50);
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--border-color);
    }

    .table-row {
      border-bottom: 1px solid var(--border-color);
      transition: background 0.2s;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: var(--gray-50);
    }

    .product-cell {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .product-image-small {
      width: 60px;
      height: 60px;
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      flex-shrink: 0;
      background: var(--gray-100);
    }

    .product-image-small img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-name {
      font-weight: 600;
      color: var(--gray-900);
    }

    .organic-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--primary-color);
      font-weight: 600;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 10px;
      background: var(--gray-100);
      color: var(--text-secondary);
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .price {
      font-weight: 700;
      color: var(--primary-color);
      font-size: 1.125rem;
    }

    .stock-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #D1FAE5;
      color: #059669;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .stock-badge.low {
      background: #FEF3C7;
      color: #D97706;
    }

    .stock-badge.out {
      background: #FEE2E2;
      color: #DC2626;
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #F59E0B;
      font-weight: 600;
    }

    .reviews-count {
      color: var(--text-tertiary);
      font-weight: 400;
      font-size: 0.875rem;
    }

    .col-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--border-radius-sm);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .edit-btn {
      background: #DBEAFE;
      color: #1D4ED8;
    }

    .edit-btn:hover {
      background: #3B82F6;
      color: white;
    }

    .view-btn {
      background: #D1FAE5;
      color: #059669;
    }

    .view-btn:hover {
      background: #10B981;
      color: white;
    }

    .delete-btn {
      background: #FEE2E2;
      color: #DC2626;
    }

    .delete-btn:hover {
      background: #EF4444;
      color: white;
    }

    /* Loading & Empty States */
    .loading, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
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
      font-size: 1.5rem;
      color: var(--gray-900);
      margin-bottom: 12px;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 24px;
      max-width: 400px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .table-header, .table-row {
        grid-template-columns: 2fr 0.8fr 0.8fr 0.8fr 1fr;
      }

      .col-rating {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header h1 {
        font-size: 1.75rem;
      }

      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .products-table {
        overflow-x: auto;
      }

      .table-header {
        display: none;
      }

      .table-row {
        grid-template-columns: 1fr;
        padding: 20px;
        gap: 12px;
      }

      .col-product, .col-category, .col-price, .col-stock, .col-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .col-product::before, .col-category::before, .col-price::before, .col-stock::before {
        content: attr(data-label);
        font-weight: 700;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
  `]
})
export class FarmerDashboardComponent implements OnInit {
  myProducts: Product[] = [];
  loading = true;
  
  constructor(
    private productService: ProductService,
    private farmerService: FarmerService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadMyProducts();
  }
  
  loadMyProducts(): void {
    this.farmerService.getMyProducts().subscribe({
      next: (products) => {
        this.myProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    });
  }
  
  get productsInStock(): number {
    return this.myProducts.filter(p => p.stock > 0).length;
  }
  
  get averageRating(): number {
    if (this.myProducts.length === 0) return 0;
    const sum = this.myProducts.reduce((acc, p) => acc + p.rating, 0);
    return sum / this.myProducts.length;
  }
  
  get totalRevenue(): number {
    // This is a placeholder - in real app, calculate from actual orders
    return this.myProducts.reduce((acc, p) => acc + (p.price * 10), 0);
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
}
