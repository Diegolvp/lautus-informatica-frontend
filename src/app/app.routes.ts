import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';
import { UsersComponent } from './users/users.component';
import { ItemsComponent } from './items/items.component';
import { LogsComponent } from './logs/logs.component';

export const routes: Routes = [
  { path: 'admin/logs', component: LogsComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/items', component: ItemsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
