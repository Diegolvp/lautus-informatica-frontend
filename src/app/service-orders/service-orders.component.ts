// service-orders/service-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceOrderService } from '../services/service-order.service';
import { ServiceOrder } from '../interfaces/service-orders.interface';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, FormsModule],
  templateUrl: './service-orders.component.html',
  styleUrls: ['./service-orders.component.css'],
})
export class ServiceOrdersComponent implements OnInit {
  serviceOrders: ServiceOrder[] = [];
  filteredServiceOrders: ServiceOrder[] = [];
  loading: boolean = true;
  error: string = '';

  // Filtros
  filters = {
    status: '',
    userId: '',
  };

  // Opções de status
  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'Pending', label: 'Pendente' },
    { value: 'InProgress', label: 'Em Andamento' },
    { value: 'Completed', label: 'Concluído' },
    { value: 'Cancelled', label: 'Cancelado' },
  ];

  constructor(
    private serviceOrderService: ServiceOrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServiceOrders();
  }

  loadServiceOrders() {
    this.loading = true;
    this.error = '';

    this.serviceOrderService.getServiceOrders().subscribe({
      next: (response) => {
        this.serviceOrders = response.data || [];
        this.filteredServiceOrders = [...this.serviceOrders];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar ordens de serviço';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  onFilterChange() {
    this.filteredServiceOrders = this.serviceOrders.filter((order) => {
      let statusMatch = true;
      let userMatch = true;

      if (this.filters.status) {
        statusMatch = order.status === this.filters.status;
      }

      if (this.filters.userId) {
        userMatch = order.userId.toString().includes(this.filters.userId);
      }

      return statusMatch && userMatch;
    });
  }

  viewServiceOrder(id: number) {
    this.router.navigate(['/service-orders', id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Pendente';
      case 'InProgress':
        return 'Em Andamento';
      case 'Completed':
        return 'Concluído';
      case 'Cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
