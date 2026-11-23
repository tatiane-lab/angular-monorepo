import { InjectionToken } from '@angular/core';

/** Minimal data the product domain hands over to the cart domain. */
export interface CartLine {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

/**
 * Port that decouples the products domain from the cart domain.
 * The host app provides the implementation (backed by the cart store), so
 * `domain:products` libs never import `domain:cart` libs.
 */
export interface CartPort {
  add(line: CartLine): void;
  quantityOf(id: string): number;
}

export const CART_PORT = new InjectionToken<CartPort>('CART_PORT', {
  providedIn: 'root',
  factory: () => ({ add: () => undefined, quantityOf: () => 0 }),
});
