import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  styleUrls: ['./items.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  showCreateModal: boolean = false;
  newItem: Partial<Item> = {
    name: '',
    description: '',
    category: 0,
    unitPrice: 0,
    quantity: 0
  };

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
          this.updateFilteredItems();
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

  categories: { value: number, text: string }[] = [
    { value: ItemCategory.Peripheral, text: 'Peripheral' },
    { value: ItemCategory.Hardware, text: 'Hardware' },
    { value: ItemCategory.Software, text: 'Software' },
    { value: ItemCategory.Accessory, text: 'Accessory' },
    { value: ItemCategory.Other, text: 'Other' }
  ];

  filteredItems: Item[] = [];
  totalItems: number = 0;
  lowStockItems: number = 0;
  totalValue: number = 0;


  // Filtros e busca
  updateFilteredItems(): void {
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

    this.filteredItems = filtered;
    this.totalItems = this.items.length;
    this.lowStockItems = this.items.filter(item => item.quantity <= 5 && item.quantity > 0).length;
    this.totalValue = this.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }

  // ✅ Chame este método quando os filtros mudarem
  filterItems(): void {
    this.updateFilteredItems();
  }

  sortItems(): void {
    this.updateFilteredItems();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 0;
    this.sortBy = 'name';
    this.updateFilteredItems();
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

  openCreateModal(): void {
    this.showCreateModal = true;
    // Resetar formulário
    this.newItem = {
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      category: 1
    };
  }

  // Fechar modal
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Validar formulário
  isFormValid(): boolean {
    return !!this.newItem.name &&
      !!this.newItem.category &&
      this.newItem.unitPrice !== undefined &&
      this.newItem.quantity !== undefined;
  }

  // Submeter novo item
  submitNewItem(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    console.log(this.newItem);

    this.http.post<ItemResponse>('http://localhost:5170/api/items', this.newItem)
      .subscribe({
        next: (response) => {
          // Adiciona o novo item à lista
          if (response.data) {
            this.items.unshift(response.data[0]);
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
        }
      });
  }
}