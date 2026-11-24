import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore, MAX_QUANTITY } from '@nx-angular-monorepo/data-access-cart';
import { ButtonComponent, CardComponent, StateMessageComponent } from '@nx-angular-monorepo/ui-components';
import { formatCurrency } from '@nx-angular-monorepo/util-common';

@Component({
  selector: 'feature-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, CardComponent, StateMessageComponent],
  template: `
    <h1>Carrinho</h1>
    @if (checkedOut()) {
      <ui-state-message icon="🎉" title="Pedido simulado com sucesso!" message="Este é um projeto de demonstração, nenhum pagamento foi feito.">
        <a routerLink="/products"><ui-button>Continuar comprando</ui-button></a>
      </ui-state-message>
    } @else if (cart.isEmpty()) {
      <ui-state-message icon="🛒" title="Seu carrinho está vazio" message="Adicione produtos do catálogo para vê-los aqui.">
        <a routerLink="/products"><ui-button>Ver produtos</ui-button></a>
      </ui-state-message>
    } @else {
      <div class="layout">
        <ul class="items">
          @for (item of cart.items(); track item.id) {
            <li>
              <ui-card class="item">
                <img [src]="item.imageUrl" [alt]="item.name" width="96" height="72" />
                <div class="name">
                  <a [routerLink]="['/products', item.id]">{{ item.name }}</a>
                  <span class="unit">{{ money(item.price) }} cada</span>
                </div>
                <div class="qty" role="group" [attr.aria-label]="'Quantidade de ' + item.name">
                  <ui-button variant="secondary" size="sm" (clicked)="cart.setQuantity(item.id, item.quantity - 1)">−</ui-button>
                  <output>{{ item.quantity }}</output>
                  <ui-button variant="secondary" size="sm" [disabled]="item.quantity >= max" (clicked)="cart.setQuantity(item.id, item.quantity + 1)">+</ui-button>
                </div>
                <strong class="line">{{ money(item.price * item.quantity) }}</strong>
                <ui-button variant="ghost" size="sm" (clicked)="cart.remove(item.id)" aria-label="Remover item">✕</ui-button>
              </ui-card>
            </li>
          }
        </ul>
        <ui-card class="summary">
          <div class="summary-in">
            <h2>Resumo</h2>
            <div class="row"><span>Itens</span><span>{{ cart.count() }}</span></div>
            <div class="row total"><span>Subtotal</span><span>{{ money(cart.subtotal()) }}</span></div>
            <ui-button [block]="true" size="lg" (clicked)="checkout()">Finalizar compra</ui-button>
            <ui-button [block]="true" variant="ghost" (clicked)="cart.clear()">Esvaziar carrinho</ui-button>
          </div>
        </ui-card>
      </div>
    }
  `,
  styles: `
    h1 { margin: 0 0 1.5rem; font-size: 1.8rem; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1.5rem; align-items: start; }
    .items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .item { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto auto auto; gap: 1rem; align-items: center; padding: 0.75rem; }
    .item img { width: 96px; height: 72px; object-fit: cover; border-radius: var(--radius-sm); }
    .name { display: flex; flex-direction: column; min-width: 0; }
    .name a { color: var(--text); text-decoration: none; font-weight: 600; }
    .name a:hover { color: var(--accent); }
    .unit { color: var(--text-muted); font-size: 0.8rem; }
    .qty { display: flex; align-items: center; gap: 0.4rem; }
    .qty output { min-width: 1.6rem; text-align: center; font-weight: 600; }
    .line { min-width: 5.5rem; text-align: right; }
    .summary-in { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
    h2 { margin: 0; font-size: 1.1rem; }
    .row { display: flex; justify-content: space-between; color: var(--text-muted); }
    .total { color: var(--text); font-weight: 800; font-size: 1.2rem; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
    @media (max-width: 560px) {
      .item { grid-template-columns: 72px minmax(0, 1fr) auto; }
      .item img { width: 72px; height: 54px; }
      .qty { grid-column: 2; }
      .line { grid-column: 3; grid-row: 2; }
    }
  `,
})
export class CartComponent {
  protected readonly cart = inject(CartStore);
  protected readonly max = MAX_QUANTITY;
  protected readonly money = formatCurrency;
  protected readonly checkedOut = signal(false);

  protected checkout(): void {
    this.cart.clear();
    this.checkedOut.set(true);
  }
}
