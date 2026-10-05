import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { ProductsService } from './products.service';
import { Product } from './product.model';

interface ProductsState {
  products: Product[];
  selectedProductId: string | null;
  isLoading: boolean;
  error: string | null;
  filters: { category?: string; search?: string };
}

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<ProductsState>({
    products: [],
    selectedProductId: null,
    isLoading: false,
    error: null,
    filters: {},
  }),
  withComputed(({ products, selectedProductId, filters }) => ({
    selectedProduct: computed(() =>
      products().find((p) => p.id === selectedProductId())
    ),
    filteredProducts: computed(() => {
      const { category, search } = filters();
      return products().filter((p) => {
        const matchesCategory = !category || p.category === category;
        const matchesSearch =
          !search || p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }),
    categories: computed(() => [...new Set(products().map((p) => p.category))]),
  })),
  withMethods((store, service = inject(ProductsService)) => ({
    loadProducts() {
      patchState(store, { isLoading: true });
      service.getAll().subscribe({
        next: (products) => patchState(store, { products, isLoading: false }),
        error: (err) =>
          patchState(store, { error: err.message, isLoading: false }),
      });
    },
    setFilters(filters: Partial<ProductsState['filters']>) {
      patchState(store, { filters: { ...store.filters(), ...filters } });
    },
    selectProduct(id: string | null) {
      patchState(store, { selectedProductId: id });
    },
  }))
);
