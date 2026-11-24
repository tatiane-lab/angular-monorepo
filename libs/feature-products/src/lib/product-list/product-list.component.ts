import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsStore, SortKey } from '@nx-angular-monorepo/data-access-products';
import { BadgeComponent, ButtonComponent, CardComponent, StateMessageComponent } from '@nx-angular-monorepo/ui-components';
import { CART_PORT, formatCurrency } from '@nx-angular-monorepo/util-common';

@Component({
  selector: 'feature-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, CardComponent, BadgeComponent, StateMessageComponent],
  template: `
    <header class="head">
      <div>
        <h1>Produtos</h1>
        <p class="muted">{{ store.filteredProducts().length }} item(ns) encontrado(s)</p>
      </div>
      <div class="filters">
        <input
          type="search"
          aria-label="Buscar produtos"
          placeholder="Buscar produtos..."
          [value]="store.filters().search"
          (input)="store.setFilters({ search: $any($event.target).value })"
        />
        <select
          aria-label="Categoria"
          [value]="store.filters().category"
          (change)="store.setFilters({ category: $any($event.target).value })"
        >
          <option value="">Todas as categorias</option>
          @for (cat of store.categories(); track cat) {
            <option [value]="cat" [selected]="cat === store.filters().category">{{ cat }}</option>
          }
        </select>
        <select aria-label="Ordenar" [value]="store.filters().sort" (change)="onSort($any($event.target).value)">
          <option value="relevance">Relevância</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="rating">Melhor avaliados</option>
        </select>
      </div>
    </header>

    @if (store.isLoading()) {
      <div class="grid" aria-busy="true">
        @for (i of skeletons; track i) {
          <div class="skeleton"></div>
        }
      </div>
    } @else if (store.error(); as error) {
      <ui-state-message kind="error" title="Falha ao carregar produtos" [message]="error">
        <ui-button (clicked)="store.loadProducts(true)">Tentar novamente</ui-button>
      </ui-state-message>
    } @else if (store.filteredProducts().length === 0) {
      <ui-state-message title="Nenhum produto encontrado" message="Ajuste a busca ou limpe os filtros.">
        @if (store.hasActiveFilters()) {
          <ui-button variant="secondary" (clicked)="store.resetFilters()">Limpar filtros</ui-button>
        }
      </ui-state-message>
    } @else {
      <div class="grid">
        @for (product of store.filteredProducts(); track product.id) {
          <ui-card [interactive]="true" class="card">
            <a [routerLink]="[product.id]" class="media" [attr.aria-label]="product.name">
              <img [src]="product.imageUrl" [alt]="product.name" loading="lazy" width="400" height="300" />
            </a>
            <div class="body">
              <div class="meta">
                <ui-badge tone="accent">{{ product.category }}</ui-badge>
                <span class="rating" [attr.aria-label]="'Nota ' + product.rating">★ {{ product.rating }}</span>
              </div>
              <h3>
                <a [routerLink]="[product.id]">{{ product.name }}</a>
              </h3>
              <div class="foot">
                <span class="price">{{ money(product.price) }}</span>
                @if (product.stock === 0) {
                  <ui-badge tone="danger">Esgotado</ui-badge>
                } @else {
                  <ui-button size="sm" (clicked)="add(product)">
                    {{ cart.quantityOf(product.id) ? 'Adicionado (' + cart.quantityOf(product.id) + ')' : 'Adicionar' }}
                  </ui-button>
                }
              </div>
            </div>
          </ui-card>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .head { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: end; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.8rem; }
    .muted { margin: 0.2rem 0 0; color: var(--text-muted); font-size: 0.9rem; }
    .filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .filters input, .filters select {
      font: inherit; padding: 0.55rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border);
      background: var(--surface); color: var(--text);
    }
    .filters input { min-width: 14rem; }
    .filters input:focus, .filters select:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
    .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .media { display: block; aspect-ratio: 4 / 3; background: var(--surface-2); }
    .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .body { padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .meta { display: flex; justify-content: space-between; align-items: center; }
    .rating { font-size: 0.8rem; color: var(--warning); font-weight: 600; }
    h3 { margin: 0; font-size: 1rem; line-height: 1.3; }
    h3 a { color: var(--text); text-decoration: none; }
    h3 a:hover { color: var(--accent); }
    .foot { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    .price { font-weight: 700; font-size: 1.1rem; }
    .skeleton { height: 330px; border-radius: var(--radius); background: linear-gradient(90deg, var(--surface-2), var(--surface), var(--surface-2)); background-size: 200% 100%; animation: shimmer 1.3s infinite; }
    @keyframes shimmer { to { background-position: -200% 0; } }
    @media (max-width: 560px) { .filters, .filters input, .filters select { width: 100%; } }
  `,
})
export class ProductListComponent implements OnInit {
  protected readonly store = inject(ProductsStore);
  protected readonly cart = inject(CART_PORT);
  protected readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly money = formatCurrency;

  ngOnInit(): void {
    this.store.loadProducts();
  }

  protected onSort(sort: string): void {
    this.store.setFilters({ sort: sort as SortKey });
  }

  protected add(p: { id: string; name: string; price: number; imageUrl: string }): void {
    this.cart.add({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl });
  }
}
