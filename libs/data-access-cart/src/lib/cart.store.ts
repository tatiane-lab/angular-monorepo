import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { CartLine } from '@nx-angular-monorepo/util-common';

export interface CartItem extends CartLine {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = 'nx-monorepo:cart';
export const MAX_QUANTITY = 10;

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode): cart stays in memory only */
  }
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: [] }),
  withComputed(({ items }) => ({
    count: computed(() => items().reduce((sum, i) => sum + i.quantity, 0)),
    subtotal: computed(() => items().reduce((sum, i) => sum + i.price * i.quantity, 0)),
    isEmpty: computed(() => items().length === 0),
  })),
  withMethods((store) => {
    const update = (items: CartItem[]) => {
      patchState(store, { items });
      persist(items);
    };
    return {
      add(line: CartLine): void {
        const items = store.items();
        const existing = items.find((i) => i.id === line.id);
        update(
          existing
            ? items.map((i) =>
                i.id === line.id ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + 1) } : i,
              )
            : [...items, { ...line, quantity: 1 }],
        );
      },
      setQuantity(id: string, quantity: number): void {
        update(
          quantity <= 0
            ? store.items().filter((i) => i.id !== id)
            : store.items().map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) } : i)),
        );
      },
      remove(id: string): void {
        update(store.items().filter((i) => i.id !== id));
      },
      clear(): void {
        update([]);
      },
      quantityOf(id: string): number {
        return store.items().find((i) => i.id === id)?.quantity ?? 0;
      },
    };
  }),
  withHooks({
    onInit(store) {
      patchState(store, { items: read() });
    },
  }),
);
