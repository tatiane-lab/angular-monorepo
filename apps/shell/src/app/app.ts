import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartStore } from '@nx-angular-monorepo/data-access-cart';
import { ThemeService } from './theme';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bar">
      <div class="bar-in">
        <a routerLink="/" class="brand"><span class="logo">N</span> Nx Store</a>
        <nav aria-label="Principal">
          <a routerLink="/products" routerLinkActive="active">Produtos</a>
          <a routerLink="/cart" routerLinkActive="active">
            Carrinho
            @if (cart.count() > 0) {
              <span class="count" [attr.aria-label]="cart.count() + ' itens'">{{ cart.count() }}</span>
            }
          </a>
          <button
            type="button"
            class="theme"
            (click)="themeService.toggle()"
            [attr.aria-label]="themeService.theme() === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'"
          >
            {{ themeService.theme() === 'dark' ? '☀️' : '🌙' }}
          </button>
        </nav>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer>Monorepo Nx · Angular · NgRx SignalStore · dados simulados</footer>
  `,
  styles: `
    .bar { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--surface) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
    .bar-in { max-width: 1200px; margin: 0 auto; padding: 0.8rem 1.25rem; display: flex; justify-content: space-between; align-items: center; }
    .brand { white-space: nowrap; display: flex; align-items: center; gap: 0.6rem; font-weight: 800; color: var(--text); text-decoration: none; }
    .logo { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--accent); color: #fff; }
    nav { display: flex; align-items: center; gap: 0.2rem; }
    nav a { white-space: nowrap; color: var(--text-muted); text-decoration: none; padding: 0.4rem 0.6rem; border-radius: 999px; font-weight: 500; }
    nav a:hover, nav a.active { color: var(--text); background: var(--surface-2); }
    .count { margin-left: 0.3rem; background: var(--accent); color: #fff; border-radius: 999px; font-size: 0.72rem; padding: 0.05rem 0.45rem; font-weight: 700; }
    .theme { font-size: 1rem; background: var(--surface-2); border: 1px solid var(--border); border-radius: 999px; width: 36px; height: 36px; cursor: pointer; }
    main { max-width: 1200px; margin: 0 auto; padding: 2rem 1.25rem 3rem; min-height: calc(100vh - 140px); }
    footer { text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1.5rem; border-top: 1px solid var(--border); }
  `,
})
export class App {
  protected readonly cart = inject(CartStore);
  protected readonly themeService = inject(ThemeService);
}
