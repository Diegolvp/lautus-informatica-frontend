import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export interface Log {
  id: number;
  userId: number;
  tableName: string;
  operationType: OperationType;
  description: string;
  operationDate: Date;
}

export enum OperationType {
  Insert = 0,
  Update = 1,
  Delete = 2,
}

export interface LogResponse extends ApiResponse<Log[]> {}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];
  loading: boolean = true;
  error: string = '';
  filteredLogs: Log[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.error = '';

    this.http.get<LogResponse>('http://localhost:5170/api/logs').subscribe({
      next: (response) => {
        this.logs = (response.data || []).map((log) => ({
          ...log,
          operationDate: new Date(log.operationDate),
        }));
        this.filteredLogs = [...this.logs];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar logs';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  getOperationTypeText(operationType: number): string {
    switch (operationType) {
      case 0:
        return 'Inserção';
      case 1:
        return 'Atualização';
      case 2:
        return 'Exclusão';
      default:
        return 'Desconhecido';
    }
  }

  getOperationTypeClass(operationType: number): string {
    switch (operationType) {
      case 0:
        return 'bg-green-100 text-green-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterLogs();
  }

  filterLogs() {
    if (!this.searchTerm) {
      this.filteredLogs = [...this.logs];
      return;
    }

    this.filteredLogs = this.logs.filter(
      (log) =>
        log.tableName.toLowerCase().includes(this.searchTerm) ||
        log.description.toLowerCase().includes(this.searchTerm) ||
        this.getOperationTypeText(log.operationType).toLowerCase().includes(this.searchTerm)
    );
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
