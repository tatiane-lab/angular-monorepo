import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsStore } from './products.store';

const mk = (id: string, name: string, category: string, price: number): Product => ({
  id,
  name,
  description: '',
  price,
  category,
  imageUrl: '',
  stock: 3,
  rating: 4,
  reviewCount: 1,
});

describe('ProductsStore', () => {
  const data = [mk('1', 'Teclado', 'Periféricos', 300), mk('2', 'Monitor', 'Monitores', 900), mk('3', 'Mouse', 'Periféricos', 100)];

  function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductsService, useValue: { getAll: () => of(data) } }],
    });
    const store = TestBed.inject(ProductsStore);
    store.loadProducts();
    return store;
  }

  it('loads products and derives categories', () => {
    const store = setup();
    expect(store.loaded()).toBe(true);
    expect(store.categories()).toEqual(['Monitores', 'Periféricos']);
  });

  it('filters by category/search and sorts by price', () => {
    const store = setup();
    store.setFilters({ category: 'Periféricos', sort: 'price-asc' });
    expect(store.filteredProducts().map((p) => p.id)).toEqual(['3', '1']);
    store.setFilters({ search: 'tec' });
    expect(store.filteredProducts().map((p) => p.id)).toEqual(['1']);
    store.resetFilters();
    expect(store.hasActiveFilters()).toBe(false);
  });
});
