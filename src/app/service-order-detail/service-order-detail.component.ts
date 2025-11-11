import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceOrderService } from '../services/service-order.service';
import { ServiceOrderDetail } from '../interfaces/service-orders.interface';
import { ApiResponse } from '../interfaces/api-response';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-service-order-detail',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './service-order-detail.component.html',
  styleUrls: ['./service-order-detail.component.css'],
})
export class ServiceOrderDetailComponent implements OnInit {
  serviceOrder: ServiceOrderDetail | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceOrderService: ServiceOrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadServiceOrder(parseInt(id));
    } else {
      this.error = 'ID não fornecido';
      this.loading = false;
    }
  }

  loadServiceOrder(id: number) {
    this.loading = true;
    this.error = '';

    this.serviceOrderService.getServiceOrderById(id).subscribe({
      next: (response) => {
        this.serviceOrder = response.data || null;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar ordem de serviço';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['/service-orders']);
  }

  get currentUser() {
    return this.authService.getCurrentUser();
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
}
