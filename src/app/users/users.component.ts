import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  toggleUserStatus(user: User) {
    
  }
}