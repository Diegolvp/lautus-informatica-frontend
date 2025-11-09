import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home'}];