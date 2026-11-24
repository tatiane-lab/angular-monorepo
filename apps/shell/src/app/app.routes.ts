import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    title: 'Produtos',
    loadChildren: () => import('@nx-angular-monorepo/feature-products').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'cart',
    title: 'Carrinho',
    loadChildren: () => import('@nx-angular-monorepo/feature-cart').then((m) => m.CART_ROUTES),
  },
  {
    path: '**',
    title: 'Não encontrado',
    loadComponent: () => import('./not-found').then((m) => m.NotFound),
  },
];
