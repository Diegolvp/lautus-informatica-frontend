import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ApiResponse } from '../interfaces/api-response';

export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  role: number;
  address: string;
}

export interface UserResponse extends ApiResponse<User[]> {
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.http.get<UserResponse>('http://localhost:5170/api/users')
      .subscribe({
        next: (response) => {
          this.users = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar usuários';
          this.loading = false;
          console.error('Erro:', error);
        }
      });
  }

  getRoleText(role: number): string {
    return role === 0 ? 'Admin' : 'Cliente';
  }

  getStatusClass(status: string): string {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  editUser(user: User) {
    console.log('Editar usuário:', user);
    // Implementar edição
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  deleteUser(user: User) {
    if (confirm(`Tem certeza que deseja excluir ${user.username}?`)) {
      this.http.delete(`http://localhost:5170/api/users/${user.id}`)
        .subscribe({
          next: () => {
            this.loadUsers(); // Recarrega a lista
          },
          error: (error) => {
            alert('Erro ao excluir usuário');
            console.error('Erro:', error);
          }
        });
    }
  }

  showEditModal: boolean = false;
  editingUser: User | null = null;
  editUserData: Partial<User> = {};

  openEditModal(user: User): void {
    this.editingUser = user;
    this.editUserData = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
    this.editUserData = {};
  }

  isEditFormValid(): boolean {
    return !!this.editUserData.username &&
      !!this.editUserData.role &&
      this.editUserData.email !== undefined &&
      this.editUserData.address !== undefined;
  }

  submitEditUser(): void {
    if (!this.isEditFormValid() || !this.editingUser) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const userToSend = {
      ...this.editUserData,
      role: Number(this.editUserData.role)
    };

    this.loading = true;

    this.http.put<UserResponse>(`http://localhost:5170/api/Users/${this.editingUser.id}`, userToSend, { headers })
      .subscribe({
        next: (response) => {
          if (response.data && response.success) {
            // ✅ Atualiza o User na lista
            const index = this.users.findIndex(user => user.id === this.editingUser!.id);
            if (index > -1) {
            }

            // ✅ Fecha o modal
            this.closeEditModal();

            console.log('✅ User editado com sucesso!');
          } else {
            this.error = response.message || 'Erro ao editar User';
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erro ao editar User:', error);

          // ✅ Melhor tratamento de erro
          if (error.status === 500) {
            this.error = 'Erro interno no servidor ao editar User';
          } else if (error.status === 400) {
            this.error = 'Dados inválidos para edição';
          } else {
            this.error = 'Erro ao editar User';
          }

          this.loading = false;
        }
      });
  }
}