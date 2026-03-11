import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { FarmerService } from '../../core/services/farmer.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { Order, OrderStatus } from '../../core/models/order.model';
import { User } from '../../core/models/user.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent, SkeletonComponent],
  templateUrl: './farmer-dashboard.component.html',
  styleUrl: './farmer-dashboard.component.css'
})
export class FarmerDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productsChart') productsChartRef!: ElementRef<HTMLCanvasElement>;
  
  products: Product[] = [];
  loading = true;
  currentFilter: 'all' | 'low-stock' | 'out-stock' = 'all';
  currentSection: 'overview' | 'products' | 'orders' | 'messages' | 'logistics' | 'recruitment' | 'payments' | 'settings' | 'profile' = 'overview';
  currentUser: User | null = null;
  
  // Charts
  salesChart: any;
  productsChart: any;
  
  // Stats
  stats = {
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    averageRating: 0,
    totalRevenue: 0,
    ordersThisMonth: 0
  };

  recentOrders: Order[] = [];
  weeklySalesData: number[] = [0, 0, 0, 0, 0, 0, 0]; // Lun-Dim

  constructor(
    private productService: ProductService,
    private farmerService: FarmerService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFarmerProducts();
    this.loadFarmerOrders();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSalesChart();
      this.createProductsChart();
    }, 100);
  }

  createSalesChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Ventes (TND)',
            data: this.weeklySalesData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1f2937',
              padding: 12,
              cornerRadius: 8,
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: (value) => value + ' TND'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  }

  createProductsChart(): void {
    const ctx = this.productsChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.productsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tomates', 'Oranges', 'Poivrons', 'Citrons'],
          datasets: [{
            label: 'Ventes',
            data: [52, 38, 28, 24],
            backgroundColor: '#f97316',
            borderRadius: 8,
            barThickness: 50
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1f2937',
              padding: 12,
              cornerRadius: 8,
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  }

  loadFarmerProducts(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.id) {
      this.farmerService.getMyProducts().subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.calculateStats();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading products', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  loadFarmerOrders(): void {
    this.orderService.getMyFarmerOrders().subscribe({
      next: (orders: Order[]) => {
        this.recentOrders = orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        this.calculateOrderStats(orders);
        this.calculateWeeklySales(orders);
        this.updateSalesChart();
      },
      error: (error: any) => {
        console.error('Error loading farmer orders', error);
      }
    });
  }

  calculateOrderStats(orders: Order[]): void {
    // Calculate total revenue from all orders
    this.stats.totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate orders this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.stats.ordersThisMonth = orders.filter(order => 
      new Date(order.createdAt) >= firstDayOfMonth
    ).length;
  }

  calculateWeeklySales(orders: Order[]): void {
    // Initialize weekly sales data (Monday to Sunday)
    this.weeklySalesData = [0, 0, 0, 0, 0, 0, 0];
    
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = orderDate.getTime() - monday.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // If order is from this week (0-6 days from Monday)
      if (diffDays >= 0 && diffDays < 7) {
        this.weeklySalesData[diffDays] += order.totalAmount;
      }
    });
  }

  updateSalesChart(): void {
    if (this.salesChart) {
      this.salesChart.data.datasets[0].data = this.weeklySalesData;
      this.salesChart.update();
    }
  }

  calculateStats(): void {
    this.stats.totalProducts = this.products.length;
    this.stats.lowStock = this.products.filter(p => p.stock && p.stock > 0 && p.stock <= 5).length;
    this.stats.outOfStock = this.products.filter(p => !p.stock || p.stock === 0).length;
    
    const totalRating = this.products.reduce((sum, p) => sum + (p.rating || 0), 0);
    this.stats.averageRating = totalRating / this.products.length || 0;
  }

  get filteredProducts(): Product[] {
    let filtered = [...this.products];

    switch (this.currentFilter) {
      case 'low-stock':
        filtered = filtered.filter(p => p.stock && p.stock > 0 && p.stock <= 5);
        break;
      case 'out-stock':
        filtered = filtered.filter(p => !p.stock || p.stock === 0);
        break;
    }

    return filtered;
  }

  setFilter(filter: 'all' | 'low-stock' | 'out-stock'): void {
    this.currentFilter = filter;
  }

  changeSection(section: 'overview' | 'products' | 'orders' | 'messages' | 'logistics' | 'recruitment' | 'payments' | 'settings' | 'profile'): void {
    this.currentSection = section;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
