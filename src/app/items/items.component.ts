import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ApiResponse } from '../interfaces/api-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export interface ItemCreateResponse extends ApiResponse<Item> {
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, SideMenuComponent],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
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

  showEditModal: boolean = false;
  editingItem: Item | null = null;
  editItemData: Partial<Item> = {};

  showDeleteModal: boolean = false;
  itemToDelete: Item | null = null;
  deleteLoading: boolean = false;

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

  openEditModal(item: Item): void {
    this.editingItem = item;
    this.editItemData = {
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      category: item.category
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingItem = null;
    this.editItemData = {};
  }

  isEditFormValid(): boolean {
    return !!this.editItemData.name &&
      !!this.editItemData.category &&
      this.editItemData.unitPrice !== undefined &&
      this.editItemData.quantity !== undefined;
  }

  submitEditItem(): void {
    if (!this.isEditFormValid() || !this.editingItem) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const itemToSend = {
      ...this.editItemData,
      category: Number(this.editItemData.category),
      quantity: Number(this.editItemData.quantity),
      unitPrice: Number(this.editItemData.unitPrice)
    };

    this.loading = true;

    this.http.put<ItemCreateResponse>(`http://localhost:5170/api/items/${this.editingItem.id}`, itemToSend, { headers })
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Atualiza o item na lista
            const index = this.items.findIndex(item => item.id === this.editingItem!.id);
            if (index > -1) {
              this.items[index] = response.data;
            }
            this.updateFilteredItems();
          }

          this.updateFilteredItems();

          this.closeEditModal();
          this.updateFilteredItems();
          this.loading = false;
          console.log('Item editado com sucesso!');
        },
        error: (error) => {
          this.error = 'Erro ao editar item';
          this.loading = false;
          console.error('Erro:', error);
        }
      });
  }

  openDeleteModal(item: Item): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.deleteLoading = false;
  }
  confirmDelete(): void {
    if (!this.itemToDelete) return;

    this.deleteLoading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('🗑️ Excluindo item:', this.itemToDelete);

    this.http.delete<ApiResponse<boolean>>(`http://localhost:5170/api/items/${this.itemToDelete.id}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('✅ Resposta do delete:', response);

          if (response.success) {
            // Remove o item da lista
            const index = this.items.findIndex(item => item.id === this.itemToDelete!.id);
            if (index > -1) {
              this.items.splice(index, 1);
              this.updateFilteredItems();
            }
            this.closeDeleteModal();
            console.log('🎉 Item excluído com sucesso!');
          } else {
            this.error = response.message || 'Erro ao excluir item';
          }

          this.deleteLoading = false;
        },
        error: (error) => {
          console.error('❌ Erro ao excluir:', error);
        }
      });
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

    const token = this.authService.getToken();

    // Criar headers com o token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const itemToSend = {
      ...this.newItem,
      category: Number(this.newItem.category), // ✅ Converter para número
      quantity: Number(this.newItem.quantity), // ✅ Converter para número
      unitPrice: Number(this.newItem.unitPrice) // ✅ Converter para número
    };
    this.loading = true;

    console.log(this.newItem);
    console.log('Token enviado:', token);

    this.http.post<ItemCreateResponse>('http://localhost:5170/api/items', itemToSend, { headers })
      .subscribe({
        next: (response) => {
          // Adiciona o novo item à lista
          if (response.data) {
            this.items.unshift(response.data);
          }

          this.closeCreateModal();
          this.updateFilteredItems();
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