import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ClientHomeComponent } from './client-home/client-home.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AdminHomeComponent, ClientHomeComponent, SideMenuComponent],
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método helper para template
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
  
  get currentUser() {
    return this.authService.getCurrentUser();
  }
}