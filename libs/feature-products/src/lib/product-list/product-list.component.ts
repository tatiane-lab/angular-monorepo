import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from '@nx-angular-monorepo/data-access-products';
import { ButtonComponent } from '@nx-angular-monorepo/ui-components';

@Component({
  selector: 'feature-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent],
  template: `
    <div class="product-list">
      <header class="product-list__header">
        <h1>Products</h1>
        <div class="filters">
          <input
            type="search"
            placeholder="Search products..."
            [ngModel]="store.filters().search"
            (ngModelChange)="store.setFilters({ search: $event })"
          />
          <select
            [ngModel]="store.filters().category"
            (ngModelChange)="store.setFilters({ category: $event })"
          >
            <option value="">All categories</option>
            @for (cat of store.categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
      </header>

      @if (store.isLoading()) {
        <div class="product-list__skeleton">
          @for (i of [1, 2, 3, 4, 6, 8]; track i) {
            <div class="skeleton-card"></div>
          }
        </div>
      } @else if (store.filteredProducts().length === 0) {
        <p class="product-list__empty">No products found.</p>
      } @else {
        <div class="product-list__grid">
          @for (product of store.filteredProducts(); track product.id) {
            <a [routerLink]="[product.id]" class="product-card">
              <img [src]="product.imageUrl" [alt]="product.name" loading="lazy" />
              <div class="product-card__body">
                <h3>{{ product.name }}</h3>
                <p class="price">{{ product.price | currency }}</p>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  readonly store = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadProducts();
  }
}
