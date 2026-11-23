import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from './product.model';
import { ProductsService } from './products.service';

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductFilters {
  category: string;
  search: string;
  sort: SortKey;
}

interface ProductsState {
  products: Product[];
  selectedProductId: string | null;
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductsState = {
  products: [],
  selectedProductId: null,
  isLoading: false,
  loaded: false,
  error: null,
  filters: { category: '', search: '', sort: 'relevance' },
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<ProductsState>(initialState),
  withComputed(({ products, selectedProductId, filters }) => ({
    selectedProduct: computed(() => products().find((p) => p.id === selectedProductId()) ?? null),
    categories: computed(() => [...new Set(products().map((p) => p.category))].sort()),
    filteredProducts: computed(() => {
      const { category, search, sort } = filters();
      const term = search.trim().toLowerCase();
      const result = products().filter(
        (p) =>
          (!category || p.category === category) &&
          (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)),
      );
      switch (sort) {
        case 'price-asc':
          return [...result].sort((a, b) => a.price - b.price);
        case 'price-desc':
          return [...result].sort((a, b) => b.price - a.price);
        case 'rating':
          return [...result].sort((a, b) => b.rating - a.rating);
        default:
          return result;
      }
    }),
    hasActiveFilters: computed(() => !!filters().category || !!filters().search.trim()),
  })),
  withMethods((store, service = inject(ProductsService)) => ({
    loadProducts(force = false): void {
      if (store.isLoading() || (store.loaded() && !force)) return;
      patchState(store, { isLoading: true, error: null });
      service.getAll().subscribe({
        next: (products) => patchState(store, { products, isLoading: false, loaded: true }),
        error: (err: unknown) =>
          patchState(store, {
            error:
              (err as { message?: string } | null)?.message ?? 'Não foi possível carregar os produtos.',
            isLoading: false,
          }),
      });
    },
    setFilters(filters: Partial<ProductFilters>): void {
      patchState(store, { filters: { ...store.filters(), ...filters } });
    },
    resetFilters(): void {
      patchState(store, { filters: initialState.filters });
    },
    selectProduct(id: string | null): void {
      patchState(store, { selectedProductId: id });
    },
  })),
);
