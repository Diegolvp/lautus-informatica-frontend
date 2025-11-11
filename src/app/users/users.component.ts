import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ApiResponse } from '../interfaces/api-response';
import { FormsModule } from '@angular/forms';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPen, faShieldHalved, faLock, faLockOpen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';

export interface UserRequest {
  id: number;
  username: string;
  phone: string;
  email: string;
  role: number;
  address: string;
}

export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  role: number;
  address: string;
  isLocked: boolean;
}

export interface UserCreateRequest {
  id: number;
  username: string;
  password: string;
  phone: string;
  email: string;
  role: number;
  address: string;
}

export interface ChangePassRequest {
  password: string;
  verifyNewPassword: string;
}

export enum Role {
  Admin = 0,
  Client = 1,
}

export interface UserResponse extends ApiResponse<User[]> { }

export interface UserUpdateResponse extends ApiResponse<UserRequest> { }

export interface UserCreateResponse extends ApiResponse<User> { }

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, FormsModule, FaIconComponent, FaIconComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  faTrash = faTrash;
  faShieldHalved = faShieldHalved;
  faPen = faPen;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faSearch = faSearch;
  users: User[] = [];
  loading: boolean = true;
  error: string = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredUsers: User[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.http.get<UserResponse>('http://localhost:5170/api/users').subscribe({
      next: (response) => {
        this.users = response.data || [];
        this.loading = false;
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  roles: { value: number; text: string }[] = [
    { value: Role.Admin, text: 'Admin' },
    { value: Role.Client, text: 'Client' },
  ];

  getRoleText(role: number): string {
    return role === 0 ? 'Admin' : 'Cliente';
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  showEditModal: boolean = false;
  editingUser: User | null = null;
  editUserData: Partial<User> = {};

  showChangePassModal: boolean = false;
  changePassData: Partial<ChangePassRequest> = {
    password: '',
    verifyNewPassword: ''
  };

  showDeleteModal: boolean = false;
  UserToDelete: User | null = null;
  deleteLoading: boolean = false;

  showCreateModal: boolean = false;
  confirmPass: string = '';
  newUser: Partial<UserCreateRequest> = {
    username: '',
    password: '',
    phone: '',
    email: '',
    role: 0,
    address: ''
  };

  openEditModal(user: User): void {
    this.editingUser = user;
    this.editUserData = {
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      address: user.address,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
    this.editUserData = {};
  }

  isEditFormValid(): boolean {
    return (
      !!this.editUserData.username &&
      !!this.editUserData.email &&
      this.editUserData.role !== undefined &&
      !!this.editUserData.address &&
      !!this.editUserData.phone
    );
  }

  submitEditUser(): void {
    if (!this.isEditFormValid() || !this.editingUser) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const userToSend = {
      ...this.editUserData,
      role: Number(this.editUserData.role),
    };

    console.log(userToSend);
    console.log(this.editingUser.id);

    this.loading = true;

    this.http
      .put<UserResponse>(`http://localhost:5170/api/Users/${this.editingUser.id}`, userToSend, {
        headers,
      })
      .subscribe({
        next: (response) => {
          if (response.data && response.success) {
            // ✅ Atualiza o User na lista
            const index = this.users.findIndex((user) => user.id === this.editingUser!.id);
            if (index > -1) {
              this.users[index] = {
                ...this.users[index],
                ...this.editUserData,
              };
            }
            this.filteredUsers = [...this.users];
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

          if (error.status === 500) {
            this.error = 'Erro interno no servidor ao editar User';
          } else if (error.status === 400) {
            this.error = 'Dados inválidos para edição';
          } else {
            this.error = 'Erro ao editar User';
          }

          this.loading = false;
        },
      });
  }

  openDeleteModal(user: User): void {
    this.UserToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.UserToDelete = null;
    this.deleteLoading = false;
  }

  confirmDelete(): void {
    if (!this.UserToDelete) return;

    this.deleteLoading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    console.log('🗑️ Excluindo Users:', this.UserToDelete);

    this.http
      .delete<ApiResponse<boolean>>(`http://localhost:5170/api/users/${this.UserToDelete.id}`, {
        headers,
      })
      .subscribe({
        next: (response) => {
          console.log('✅ Resposta do delete:', response);

          if (response.success) {
            // Remove o Users da lista
            const index = this.users.findIndex((Users) => Users.id === this.UserToDelete!.id);
            if (index > -1) {
              this.users.splice(index, 1);
            }


            this.closeDeleteModal();
            this.filteredUsers = [...this.users]

            console.log('🎉 Users excluído com sucesso!');
          } else {
            this.error = response.message || 'Erro ao excluir Users';
          }

          this.deleteLoading = false;
        },
        error: (error) => {
          console.error('❌ Erro ao excluir:', error);
        },
      });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newUser = {
      username: '',
      password: '',
      phone: '',
      email: '',
      role: 0,
      address: '',
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  isFormValid(): boolean {
    return (
      !!this.newUser.username &&
      !!this.newUser.email &&
      !!this.newUser.address &&
      !!this.newUser.password &&
      !!this.newUser.phone &&
      !!this.confirmPass &&
      this.confirmPass === this.newUser.password &&
      this.newUser.role !== undefined
    );
  }

  submitNewUser(): void {
    if (!this.isFormValid()) return;

    const token = this.authService.getToken();

    // Criar headers com o token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const userToSend = {
      ...this.newUser,
      role: Number(this.newUser.role),
    };
    this.loading = true;

    console.log(this.newUser);
    console.log('Token enviado:', token);

    this.http
      .post<UserCreateResponse>('http://localhost:5170/api/users', userToSend, { headers })
      .subscribe({
        next: (response) => {
          // Adiciona o novo item à lista
          if (response.data) {
            this.users.unshift(response.data);
          }

          this.closeCreateModal();
          this.loading = false;

          // Feedback visual (opcional)
          console.log('Item cadastrado com sucesso!');
        },
        error: (error) => {
          this.error = 'Erro ao cadastrar item';
          this.loading = false;
          console.error('Erro:', error);
        },
      });
  }
  openChangePassModal(user: User): void {
    this.editingUser = user;
    this.showChangePassModal = true;
  }

  closeChangePassModal(): void {
    this.showChangePassModal = false;
    this.editingUser = null;
  }

  isChangePassFormValid(): boolean {
    return !!this.changePassData.password && !!this.changePassData.verifyNewPassword && this.changePassData.password === this.changePassData.verifyNewPassword;
  }

  confirmChangePass(): void {
    if (!this.isChangePassFormValid() || !this.editingUser) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const passToSend = {
      newPassword: this.changePassData.password,
      verifyNewPassword: this.changePassData.verifyNewPassword
    };

    this.loading = true;

    this.http.post<ApiResponse<boolean>>(`http://localhost:5170/api/Users/${this.editingUser.id}/change-password`, passToSend, { headers })
      .subscribe({
        next: (response) => {
          if (response.data && response.success) {
            const index = this.users.findIndex(user => user.id === this.editingUser!.id);
            if (index > -1) {
            }

            this.closeChangePassModal();

            console.log('Senha alterada com sucesso!');
          } else {
            this.error = response.message || 'Erro ao editar User';
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erro ao mudar senha:', error);

          if (error.status === 500) {
            this.error = 'Erro interno no servidor ao editar User';
          } else if (error.status === 400) {
            this.error = 'Dados inválidos para edição';
          } else {
            this.error = 'Erro  ao mudar senha';
          }

          this.loading = false;
        }
      });
  }

  getUserUnlock(user: User): boolean {
    return user.isLocked;
  }

  unlockUser(user: User): void {
    this.editingUser = user;
    if (!this.editingUser) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.loading = true;

    this.http.post<ApiResponse<object>>(`http://localhost:5170/api/Users/${this.editingUser.id}/lock`, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const index = this.users.findIndex(user => user.id === this.editingUser!.id);
            if (index > -1) {
              this.users[index].isLocked = false;
            }

            console.log('Usuario desbloquado com sucesso!');
          } else {
            this.error = response.message || 'Erro ao desbloquear User';
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erro ao mudar senha:', error);

          if (error.status === 500) {
            this.error = 'Erro interno no servidor ao desbloquear User';
          } else if (error.status === 400) {
            this.error = 'Dados inválidos para desbloquear';
          } else {
            this.error = 'Erro  ao mudar senha';
          }

          this.loading = false;
        }
      });
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      let valueA, valueB;

      switch (column) {
        case 'username':
          valueA = a.username.toLowerCase();
          valueB = b.username.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'address':
          valueA = a.address.toLowerCase();
          valueB = b.address.toLowerCase();
          break;
        case 'role':
          valueA = a.role;
          valueB = b.role;
          break;
        case 'block':
          valueA = a.isLocked;
          valueB = b.isLocked;
          break;
        default:
          return 0;
      }
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return ''; // Ícone neutro
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}