import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ApiResponse } from '../interfaces/api-response';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: number;
}

export enum ItemCategory {
  Peripheral = 1,
  Hardware = 2,
  Software = 3,
  Accessory = 4,
  Other = 5
}

export interface ItemResponse extends ApiResponse<Item[]> {
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, SideMenuComponent],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];
  // Propriedades para data binding
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  selectedCategory: any = 0;
  sortBy: string = 'name';

  // Estados da aplicação
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }




  currentUser: any = { username: 'Admin' }; // Mock user

  ngOnInit(): void {
    this.loadItems();
  }

  // EXEMPLO IMPLEMENTADO - Método de carregamento
  loadItems(): void {
    this.loading = true;
    this.error = '';

    this.http.get<ItemResponse>('http://localhost:5170/api/items')
      .subscribe({
        next: (response) => {
          this.items = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar items';
          this.loading = false;
          console.error('Erro:', error);
        }
      });
  }

  getCategoryText(category: number): string {
    switch (category) {
      case ItemCategory.Peripheral: return 'Peripheral';
      case ItemCategory.Hardware: return 'Hardware';
      case ItemCategory.Software: return 'Software';
      case ItemCategory.Accessory: return 'Accessory';
      case ItemCategory.Other: return 'Other';
      default: return 'Desconhecida';
    }
  }

  // Getter para as categorias disponíveis (para o select)
  get categories(): { value: number, text: string }[] {
    return [
      { value: ItemCategory.Peripheral, text: 'Peripheral' },
      { value: ItemCategory.Hardware, text: 'Hardware' },
      { value: ItemCategory.Software, text: 'Software' },
      { value: ItemCategory.Accessory, text: 'Accessory' },
      { value: ItemCategory.Other, text: 'Other' }
    ];
  }



  // Filtros e busca
  filterItems(): void {
    // Já é tratado pelo getter filteredItems
    console.log('Filtrando itens:', {
      searchTerm: this.searchTerm,
      category: this.selectedCategory
    });
  }

  sortItems(): void {
    // Já é tratado pelo getter filteredItems
    console.log('Ordenando por:', this.sortBy);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 0;
    this.sortBy = 'name';
    console.log('Filtros limpos');
  }

  // Métodos para ações
  openCreateModal(): void {
    console.log('Abrindo modal de criação');
    // Implementar abertura de modal
  }

  editItem(item: any): void {
    console.log('Editando item:', item);
    // Implementar edição
  }

  deleteItem(item: any): void {
    console.log('Excluindo item:', item);
    if (confirm(`Deseja realmente excluir o item "${item.name}"?`)) {
      // Implementar exclusão
      const index = this.items.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    }
  }

  // Métodos vazios para funcionalidades futuras
  toggleItemStatus(item: any): void {
    console.log('Alternando status do item:', item);
    // Implementar alternância de status
  }

  exportItems(): void {
    console.log('Exportando itens');
    // Implementar exportação
  }

  importItems(): void {
    console.log('Importando itens');
    // Implementar importação
  }

  viewItemDetails(item: any): void {
    console.log('Visualizando detalhes do item:', item);
    // Implementar visualização de detalhes
  }

  duplicateItem(item: any): void {
    console.log('Duplicando item:', item);
    // Implementar duplicação
  }

  // Getters computados
  get filteredItems(): any[] {
    let filtered = this.items;

    // Filtro por busca
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 0 && this.selectedCategory !== '0') {
      const categoryNum = Number(this.selectedCategory);
      filtered = filtered.filter(item => item.category === categoryNum);
    }

    // Ordenação
    filtered = [...filtered].sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'unitPrice':
          return a.unitPrice - b.unitPrice;
        case 'quantity':
          return a.quantity - b.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }

  get totalItems(): number {
    return this.items.length;
  }

  get lowStockItems(): number {
    return this.items.filter(item => item.quantity <= 5 && item.quantity > 0).length;
  }

  get outOfquantityItems(): number {
    return this.items.filter(item => item.quantity === 0).length;
  }

  get totalValue(): number {
    return this.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }

  // Métodos de utilidade
  getRoleText(role: number): string {
    // Mantido do seu componente original
    return role === 0 ? 'Administrador' : 'Usuário';
  }

  // Método para simular upload de imagem
  onImageUpload(event: any, item: any): void {
    console.log('Upload de imagem para:', item);
    // Implementar upload
  }

  // Método para preview rápido
  quickPreview(item: any): void {
    console.log('Preview rápido:', item);
    // Implementar preview
  }

  // Método para ajuste de estoque
  adjustquantity(item: any, newquantity: number): void {
    console.log(`Ajustando estoque de ${item.name} para ${newquantity}`);
    // Implementar ajuste de estoque
  }

  // Método para histórico do item
  viewItemHistory(item: any): void {
    console.log('Visualizando histórico do item:', item);
    // Implementar histórico
  }
}