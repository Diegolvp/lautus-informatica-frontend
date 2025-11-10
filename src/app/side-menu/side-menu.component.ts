import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  badgeColor?: string;
  isActive?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent implements OnInit {
  @Input() user: any;
  @Input() logoUrl: string = 'assets/images/logo.png';

  menuItems: MenuItem[] = [];

  constructor(private router: Router,
      private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadMenuItems();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  private loadMenuItems() {
    if (this.authService.isAdmin()) {
      this.menuItems = this.getAdminMenu();
    } else {
      this.menuItems = this.getClientMenu();
    }

    // Marcar o primeiro item como ativo por padrão
    if (this.menuItems.length > 0) {
      this.menuItems[0].isActive = true;
    }
  }

  private getAdminMenu(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: '📊',
        route: '/admin/dashboard',
        isActive: true
      },
      {
        label: 'Usuários',
        icon: '👥',
        route: '/admin/users',
      },
      {
        label: 'Clientes',
        icon: '🏢',
        route: '/admin/clients',
      },
      {
        label: 'Itens',
        icon: '📦',
        route: '/admin/items',
      },
      {
        label: 'Ordens de Serviço',
        icon: '🔧',
        route: '/admin/service-orders',
      },
      {
        label: 'Relatórios',
        icon: '📈',
        route: '/admin/reports'
      },
      {
        label: 'Configurações',
        icon: '⚙️',
        route: '/admin/settings'
      }
    ];
  }

  private getClientMenu(): MenuItem[] {
    return [
      {
        label: 'Minha Conta',
        icon: '👤',
        route: '/client/dashboard',
        isActive: true
      },
      {
        label: 'Meus Pedidos',
        icon: '📦',
        route: '/client/orders',
        badge: 5,
        badgeColor: 'blue'
      },
      {
        label: 'Orçamentos',
        icon: '💰',
        route: '/client/quotes',
        badge: 2,
        badgeColor: 'green'
      },
      {
        label: 'Suporte',
        icon: '🔧',
        route: '/client/support',
        badge: 1,
        badgeColor: 'yellow'
      },
      {
        label: 'Meus Dados',
        icon: '📝',
        route: '/client/profile'
      }
    ];
  }

  navigateTo(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  setActiveItem(clickedItem: MenuItem) {
    this.menuItems.forEach(item => {
      item.isActive = item === clickedItem;
    });
  }

  getMenuItemClasses(item: MenuItem): string {
    const baseClasses = 'flex items-center px-4 py-3 rounded-lg';

    if (item.isActive) {
      return `${baseClasses} bg-blue-50 text-blue-600 border-l-4 border-blue-600`;
    }

    return `${baseClasses} text-gray-700 hover:bg-gray-50 hover:text-gray-900`;
  }

  getBadgeClasses(item: MenuItem): string {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };

    return colorMap[item.badgeColor || 'blue'];
  }

  getUserInitials(): string {
    if (!this.user?.name) return 'A';

    return this.user.name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}