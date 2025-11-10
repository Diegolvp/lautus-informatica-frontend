import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { SideMenuComponent } from './side-menu/side-menu.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SideMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('lautus-informatica');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
}
