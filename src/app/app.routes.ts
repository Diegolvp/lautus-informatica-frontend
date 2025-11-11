import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';
import { UsersComponent } from './users/users.component';
import { ItemsComponent } from './items/items.component';
import { LogsComponent } from './logs/logs.component';
import { ServiceOrdersComponent } from './service-orders/service-orders.component';
import { ServiceOrderDetailComponent } from './service-order-detail/service-order-detail.component';

export const routes: Routes = [
  { path: 'service-orders', component: ServiceOrdersComponent },
  { path: 'service-orders/:id', component: ServiceOrderDetailComponent },
  { path: 'admin/logs', component: LogsComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/items', component: ItemsComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
