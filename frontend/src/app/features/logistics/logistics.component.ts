import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DeliveryService } from '../../core/services/delivery.service';
import { DeliveryRoute, RouteStatus } from '../../core/models/delivery.model';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestion Logistique</h1>
            <p class="text-gray-600 mt-2">Gérez vos tournées et livraisons</p>
          </div>
          <button (click)="createRoute()" 
                  class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            <i class="fas fa-plus mr-2"></i>Nouvelle tournée
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Tournées planifiées</p>
                <p class="text-2xl font-bold text-blue-600">{{getCountByStatus(RouteStatus.PLANNED)}}</p>
              </div>
              <i class="fas fa-calendar-alt text-3xl text-blue-500"></i>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">En cours</p>
                <p class="text-2xl font-bold text-yellow-600">{{getCountByStatus(RouteStatus.IN_PROGRESS)}}</p>
              </div>
              <i class="fas fa-truck text-3xl text-yellow-500"></i>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Terminées</p>
                <p class="text-2xl font-bold text-green-600">{{getCountByStatus(RouteStatus.COMPLETED)}}</p>
              </div>
              <i class="fas fa-check-circle text-3xl text-green-500"></i>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-2xl font-bold text-gray-900">{{routes.length}}</p>
              </div>
              <i class="fas fa-route text-3xl text-gray-500"></i>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex gap-2">
            <button *ngFor="let status of statuses" 
                    (click)="filterByStatus(status)"
                    [class]="getFilterButtonClass(status)"
                    class="px-4 py-2 rounded-lg transition">
              {{formatStatus(status)}}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>

        <!-- Routes List -->
        <div *ngIf="!loading && filteredRoutes.length > 0" class="space-y-4">
          <div *ngFor="let route of filteredRoutes" 
               class="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <!-- Route Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  <i class="fas fa-truck mr-2 text-green-600"></i>
                  Tournée #{{route.id?.substring(0, 8)}}
                </h3>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-user mr-1"></i>{{route.driverName}}</span>
                  <span><i class="fas fa-car mr-1"></i>{{route.vehicleType}} - {{route.vehicleNumber}}</span>
                  <span><i class="fas fa-calendar mr-1"></i>{{formatDate(route.scheduledDate)}}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span [class]="getStatusBadgeClass(route.status)" class="px-3 py-1 rounded-full text-sm font-semibold">
                  {{formatStatus(route.status)}}
                </span>
                <button (click)="viewRoute(route.id!)" 
                        class="text-green-600 hover:text-green-800">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>

            <!-- Route Stats -->
            <div class="grid grid-cols-4 gap-4 mb-4">
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-2xl font-bold text-gray-900">{{route.stops?.length || 0}}</p>
                <p class="text-xs text-gray-600">Arrêts</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-2xl font-bold text-gray-900">{{route.totalOrders || 0}}</p>
                <p class="text-xs text-gray-600">Commandes</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-2xl font-bold text-gray-900">{{route.totalDistance || 0}} km</p>
                <p class="text-xs text-gray-600">Distance</p>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-2xl font-bold text-green-600">{{getDeliveredCount(route)}}</p>
                <p class="text-xs text-gray-600">Livrées</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progression</span>
                <span>{{getProgressPercentage(route)}}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full transition-all" 
                     [style.width.%]="getProgressPercentage(route)"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t">
              <button *ngIf="route.status === 'PLANNED'" 
                      (click)="startRoute(route.id!)"
                      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <i class="fas fa-play mr-2"></i>Démarrer
              </button>
              <button *ngIf="route.status === 'IN_PROGRESS'" 
                      (click)="completeRoute(route.id!)"
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <i class="fas fa-check mr-2"></i>Terminer
              </button>
              <button (click)="viewRoute(route.id!)"
                      class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <i class="fas fa-eye mr-2"></i>Détails
              </button>
              <button (click)="editRoute(route.id!)"
                      class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <i class="fas fa-edit mr-2"></i>Modifier
              </button>
              <button (click)="deleteRoute(route.id!)"
                      class="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
                <i class="fas fa-trash mr-2"></i>Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredRoutes.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <i class="fas fa-truck text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune tournée</h3>
          <p class="text-gray-600 mb-6">
            {{selectedStatus ? 'Aucune tournée avec ce statut' : 'Commencez par créer une nouvelle tournée'}}
          </p>
          <button (click)="createRoute()" 
                  class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            <i class="fas fa-plus mr-2"></i>Créer une tournée
          </button>
        </div>
      </div>
    </div>
  `
})
export class LogisticsComponent implements OnInit {
  routes: DeliveryRoute[] = [];
  filteredRoutes: DeliveryRoute[] = [];
  loading = true;
  selectedStatus: RouteStatus | null = null;
  
  // Expose enum to template
  RouteStatus = RouteStatus;
  statuses = Object.values(RouteStatus);

  constructor(
    private deliveryService: DeliveryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.loading = true;
    this.deliveryService.getAllRoutes().subscribe({
      next: (response) => {
        if (response.success) {
          this.routes = response.routes;
          this.applyFilter();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.loading = false;
      }
    });
  }

  filterByStatus(status: RouteStatus) {
    this.selectedStatus = this.selectedStatus === status ? null : status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedStatus) {
      this.filteredRoutes = this.routes.filter(r => r.status === this.selectedStatus);
    } else {
      this.filteredRoutes = [...this.routes];
    }
  }

  getCountByStatus(status: RouteStatus): number {
    return this.routes.filter(r => r.status === status).length;
  }

  getDeliveredCount(route: DeliveryRoute): number {
    return route.stops?.filter(s => s.status === 'DELIVERED').length || 0;
  }

  getProgressPercentage(route: DeliveryRoute): number {
    if (!route.stops || route.stops.length === 0) return 0;
    const delivered = this.getDeliveredCount(route);
    return Math.round((delivered / route.stops.length) * 100);
  }

  startRoute(id: string) {
    this.deliveryService.startRoute(id).subscribe({
      next: () => {
        alert('Tournée démarrée!');
        this.loadRoutes();
      },
      error: () => alert('Erreur')
    });
  }

  completeRoute(id: string) {
    if (!confirm('Marquer cette tournée comme terminée ?')) return;
    this.deliveryService.completeRoute(id).subscribe({
      next: () => {
        alert('Tournée terminée!');
        this.loadRoutes();
      },
      error: () => alert('Erreur')
    });
  }

  deleteRoute(id: string) {
    if (!confirm('Supprimer cette tourn ée ?')) return;
    this.deliveryService.deleteRoute(id).subscribe({
      next: () => this.loadRoutes(),
      error: () => alert('Erreur')
    });
  }

  createRoute() {
    this.router.navigate(['/logistics/create']);
  }

  viewRoute(id: string) {
    this.router.navigate(['/logistics', id]);
  }

  editRoute(id: string) {
    this.router.navigate(['/logistics/edit', id]);
  }

  getFilterButtonClass(status: RouteStatus): string {
    const base = 'px-4 py-2 rounded-lg transition';
    return this.selectedStatus === status 
      ? base + ' bg-green-600 text-white'
      : base + ' bg-gray-100 text-gray-700 hover:bg-gray-200';
  }

  getStatusBadgeClass(status: RouteStatus): string {
    const classes: {[key in RouteStatus]: string} = {
      'PLANNED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  formatStatus(status: RouteStatus): string {
    const statuses: {[key in RouteStatus]: string} = {
      'PLANNED': 'Planifiée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return statuses[status] || status;
  }

  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  }
}
