import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsStore } from '@nx-angular-monorepo/data-access-products';
import { BadgeComponent, ButtonComponent, SpinnerComponent, StateMessageComponent } from '@nx-angular-monorepo/ui-components';
import { CART_PORT, formatCurrency } from '@nx-angular-monorepo/util-common';

@Component({
  selector: 'feature-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BadgeComponent, ButtonComponent, SpinnerComponent, StateMessageComponent],
  template: `
    <a routerLink=".." class="back">← Voltar aos produtos</a>

    @if (store.isLoading()) {
      <div class="center"><ui-spinner [size]="36" /></div>
    } @else if (product(); as p) {
      <article class="detail">
        <img [src]="p.imageUrl" [alt]="p.name" width="600" height="450" />
        <div class="info">
          <ui-badge tone="accent">{{ p.category }}</ui-badge>
          <h1>{{ p.name }}</h1>
          <p class="rating">★ {{ p.rating }} <span>({{ p.reviewCount }} avaliações)</span></p>
          <p class="desc">{{ p.description }}</p>
          <p class="price">{{ money(p.price) }}</p>
          @if (p.stock === 0) {
            <ui-badge tone="danger">Esgotado</ui-badge>
          } @else {
            <p class="stock">
              <ui-badge [tone]="p.stock <= 5 ? 'warning' : 'success'">
                {{ p.stock <= 5 ? 'Restam ' + p.stock + ' unidades' : 'Em estoque' }}
              </ui-badge>
            </p>
            <ui-button size="lg" (clicked)="cart.add({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })">
              Adicionar ao carrinho{{ cart.quantityOf(p.id) ? ' (' + cart.quantityOf(p.id) + ')' : '' }}
            </ui-button>
          }
        </div>
      </article>
    } @else {
      <ui-state-message title="Produto não encontrado" icon="🕳️" message="O produto pode ter sido removido.">
        <a routerLink=".."><ui-button variant="secondary">Ver catálogo</ui-button></a>
      </ui-state-message>
    }
  `,
  styles: `
    .back { color: var(--text-muted); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
    .back:hover { color: var(--accent); }
    .center { display: flex; justify-content: center; padding: 4rem; }
    .detail { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2rem; align-items: start; }
    img { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); }
    .info { display: flex; flex-direction: column; gap: 0.6rem; align-items: flex-start; }
    h1 { margin: 0; font-size: 2rem; line-height: 1.2; }
    .rating { margin: 0; color: var(--warning); font-weight: 600; }
    .rating span { color: var(--text-muted); font-weight: 400; font-size: 0.85rem; }
    .desc { color: var(--text-muted); margin: 0; line-height: 1.6; }
    .price { font-size: 2rem; font-weight: 800; margin: 0.4rem 0; }
    .stock { margin: 0; }
    @media (max-width: 760px) { .detail { grid-template-columns: 1fr; } }
  `,
})
export class ProductDetailComponent {
  /** Bound from the `:id` route param (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly store = inject(ProductsStore);
  protected readonly cart = inject(CART_PORT);
  protected readonly money = formatCurrency;
  protected readonly product = computed(() => this.store.products().find((p) => p.id === this.id()) ?? null);

  constructor() {
    this.store.loadProducts();
    effect(() => this.store.selectProduct(this.id()));
  }
}
