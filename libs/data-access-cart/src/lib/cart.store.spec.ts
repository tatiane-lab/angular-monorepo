import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';

const line = { id: 'a', name: 'A', price: 10, imageUrl: '' };

describe('CartStore', () => {
  beforeEach(() => localStorage.clear());

  it('adds, increments and computes totals', () => {
    const store = TestBed.inject(CartStore);
    store.add(line);
    store.add(line);
    expect(store.count()).toBe(2);
    expect(store.subtotal()).toBe(20);
  });

  it('removes items when quantity reaches zero', () => {
    const store = TestBed.inject(CartStore);
    store.add(line);
    store.setQuantity('a', 0);
    expect(store.isEmpty()).toBe(true);
  });
});
