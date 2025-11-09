import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ClientHomeComponent } from './client-home/client-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AdminHomeComponent, ClientHomeComponent],
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  // Método helper para template
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}