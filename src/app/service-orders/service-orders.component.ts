// service-orders/service-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPen, faCheck, faCogs, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ServiceOrderService } from '../services/service-order.service';
import {
  ServiceOrder,
  ServiceOrderCreateRequest,
  ServiceOrderUpdateRequest,
  Status,
} from '../interfaces/service-orders.interface';

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, FormsModule, FontAwesomeModule],
  templateUrl: './service-orders.component.html',
  styleUrls: ['./service-orders.component.css'],
})
export class ServiceOrdersComponent implements OnInit {
  // Ícones
  faTrash = faTrash;
  faPen = faPen;
  faCheck = faCheck;
  faCogs = faCogs;
  faPlus = faPlus;

  Status = Status;

  // Dados
  serviceOrders: ServiceOrder[] = [];
  filteredServiceOrders: ServiceOrder[] = [];
  loading: boolean = true;
  error: string = '';

  // Modais
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showStatusModal: boolean = false;
  showCompleteModal: boolean = false;

  // Dados para modais
  newServiceOrder: Partial<ServiceOrderCreateRequest> = {
    equipment: '',
    problem: '',
    userId: 0,
    description: '',
    servicePrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
  };
  editingServiceOrder: ServiceOrder | null = null;
  editServiceOrderData: Partial<ServiceOrderUpdateRequest> = {};
  serviceOrderToDelete: ServiceOrder | null = null;
  serviceOrderToChangeStatus: ServiceOrder | null = null;
  serviceOrderToComplete: ServiceOrder | null = null;

  // Filtros
  filters = {
    status: '',
    userId: '',
  };

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'Pending', label: 'Pendente' },
    { value: 'InProgress', label: 'Em Andamento' },
    { value: 'WaitingParts', label: 'Aguardando Peças' },
    { value: 'Completed', label: 'Concluído' },
    { value: 'Cancelled', label: 'Cancelado' },
    { value: 'Archived', label: 'Arquivado' },
  ];

  // Para conclusão
  completionDate: string = new Date().toISOString().split('T')[0];

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

  // Modais de criação
  openCreateModal(event?: Event): void {
    if (event) event.stopPropagation();
    this.showCreateModal = true;
    this.newServiceOrder = {
      equipment: '',
      problem: '',
      userId: 0,
      description: '',
      servicePrice: 0,
      entryDate: new Date().toISOString().split('T')[0],
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  isCreateFormValid(): boolean {
    return (
      !!this.newServiceOrder.equipment &&
      !!this.newServiceOrder.problem &&
      !!this.newServiceOrder.userId &&
      this.newServiceOrder.servicePrice !== undefined &&
      !!this.newServiceOrder.entryDate
    );
  }

  submitNewServiceOrder(): void {
    if (!this.isCreateFormValid()) return;

    const token = this.authService.getToken() || '';
    this.loading = true;

    this.serviceOrderService
      .createServiceOrder(this.newServiceOrder as ServiceOrderCreateRequest, token)
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.serviceOrders.unshift(response.data);
            this.filteredServiceOrders = [...this.serviceOrders];
          }
          this.closeCreateModal();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao criar ordem de serviço';
          this.loading = false;
          console.error('Erro:', error);
        },
      });
  }

  // Modais de edição
  openEditModal(serviceOrder: ServiceOrder, event?: Event): void {
    if (event) event.stopPropagation();
    this.editingServiceOrder = serviceOrder;
    this.editServiceOrderData = {
      equipment: serviceOrder.equipment,
      problem: serviceOrder.problem,
      userId: serviceOrder.userId,
      description: serviceOrder.description,
      servicePrice: serviceOrder.servicePrice,
      entryDate: serviceOrder.entryDate,
      completionDate: serviceOrder.completionDate,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingServiceOrder = null;
    this.editServiceOrderData = {};
  }

  isEditFormValid(): boolean {
    return (
      !!this.editServiceOrderData.equipment &&
      !!this.editServiceOrderData.problem &&
      !!this.editServiceOrderData.userId &&
      this.editServiceOrderData.servicePrice !== undefined &&
      !!this.editServiceOrderData.entryDate
    );
  }

  submitEditServiceOrder(): void {
    if (!this.isEditFormValid() || !this.editingServiceOrder) return;

    const token = this.authService.getToken() || '';
    this.loading = true;

    this.serviceOrderService
      .updateServiceOrder(
        this.editingServiceOrder.id,
        this.editServiceOrderData as ServiceOrderUpdateRequest,
        token
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            const index = this.serviceOrders.findIndex(
              (order) => order.id === this.editingServiceOrder!.id
            );
            if (index > -1) {
              this.serviceOrders[index] = response.data;
              this.filteredServiceOrders = [...this.serviceOrders];
            }
          }
          this.closeEditModal();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao editar ordem de serviço';
          this.loading = false;
          console.error('Erro:', error);
        },
      });
  }

  // Modal de exclusão
  openDeleteModal(serviceOrder: ServiceOrder, event?: Event): void {
    if (event) event.stopPropagation();
    this.serviceOrderToDelete = serviceOrder;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.serviceOrderToDelete = null;
  }

  confirmDelete(): void {
    if (!this.serviceOrderToDelete) return;

    const token = this.authService.getToken() || '';
    this.loading = true;

    this.serviceOrderService.deleteServiceOrder(this.serviceOrderToDelete.id, token).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.serviceOrders.findIndex(
            (order) => order.id === this.serviceOrderToDelete!.id
          );
          if (index > -1) {
            this.serviceOrders.splice(index, 1);
            this.filteredServiceOrders = [...this.serviceOrders];
          }
        }
        this.closeDeleteModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao excluir ordem de serviço';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  // Modal de status
  openStatusModal(serviceOrder: ServiceOrder, event?: Event): void {
    if (event) event.stopPropagation();
    this.serviceOrderToChangeStatus = serviceOrder;

    // Converter para número
    this.statusChange = Number(this.getStatusNumber(serviceOrder.status));

    console.log('=== OPEN STATUS MODAL ===');
    console.log('Status da ordem:', serviceOrder.status);
    console.log('statusChange (NÚMERO):', this.statusChange, 'Tipo:', typeof this.statusChange);

    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.serviceOrderToChangeStatus = null;
  }

  // service-orders.component.ts
  submitStatusChange(): void {
    console.log('=== SUBMIT STATUS CHANGE ===');

    // CONVERTER PARA NÚMERO
    const statusToSend = Number(this.statusChange);
    console.log('Status a enviar (NÚMERO):', statusToSend, 'Tipo:', typeof statusToSend);

    if (!this.serviceOrderToChangeStatus) return;

    const token = this.authService.getToken() || '';
    this.loading = true;

    const payload = {
      changeStatusRequestDTO: {
        Status: statusToSend, // ✅ Número, não string
      },
    };

    console.log('Payload final:', payload);

    this.serviceOrderService
      .changeStatus(this.serviceOrderToChangeStatus.id, statusToSend, token)
      .subscribe({
        next: (response) => {
          console.log('✅ Sucesso:', response);
          if (response.success) {
            const index = this.serviceOrders.findIndex(
              (order) => order.id === this.serviceOrderToChangeStatus!.id
            );
            if (index > -1) {
              this.serviceOrders[index].status = this.getStatusText(statusToSend);
              this.filteredServiceOrders = [...this.serviceOrders];
            }
          }
          this.closeStatusModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erro completo:', error);
          console.error('❌ Detalhes do erro:', error.error);

          this.error = error.error?.Message || 'Erro ao alterar status';
          this.loading = false;
        },
      });
  }
  // Modal de conclusão
  openCompleteModal(serviceOrder: ServiceOrder, event?: Event): void {
    if (event) event.stopPropagation();
    this.serviceOrderToComplete = serviceOrder;
    this.completionDate = new Date().toISOString().split('T')[0];
    this.showCompleteModal = true;
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
    this.serviceOrderToComplete = null;
  }

  submitComplete(): void {
    if (!this.serviceOrderToComplete) return;

    const token = this.authService.getToken() || '';
    this.loading = true;

    this.serviceOrderService
      .completeServiceOrder(this.serviceOrderToComplete.id, this.completionDate, token)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const index = this.serviceOrders.findIndex(
              (order) => order.id === this.serviceOrderToComplete!.id
            );
            if (index > -1) {
              this.serviceOrders[index].status = 'Completed';
              this.serviceOrders[index].completionDate = this.completionDate;
              this.filteredServiceOrders = [...this.serviceOrders];
            }
          }
          this.closeCompleteModal();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao concluir ordem de serviço';
          this.loading = false;
          console.error('Erro:', error);
        },
      });
  }

  // Utilitários
  statusChange: number = Status.Pending; // = 1

  getStatusNumber(status: string): number {
    switch (status) {
      case 'Pending':
        return Status.Pending; // 1
      case 'InProgress':
        return Status.InProgress; // 2
      case 'WaitingParts':
        return Status.WaitingParts; // 3
      case 'Completed':
        return Status.Completed; // 4
      case 'Cancelled':
        return Status.Cancelled; // 5
      case 'Archived':
        return Status.Archived; // 6
      default:
        return Status.Pending; // 1 como padrão
    }
  }

  getStatusText(status: string | number): string {
    if (typeof status === 'string') {
      return status;
    }
    switch (status) {
      case Status.Pending:
        return 'Pending';
      case Status.InProgress:
        return 'InProgress';
      case Status.WaitingParts:
        return 'WaitingParts';
      case Status.Completed:
        return 'Completed';
      case Status.Cancelled:
        return 'Cancelled';
      case Status.Archived:
        return 'Archived';
      default:
        return 'Pending';
    }
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'WaitingParts':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
