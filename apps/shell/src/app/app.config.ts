import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { CartStore } from '@nx-angular-monorepo/data-access-cart';
import { CART_PORT } from '@nx-angular-monorepo/util-common';
import { routes } from './app.routes';
import { mockApiInterceptor } from './mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    // O backend real é substituído por um mock em memória para a demo rodar sozinha.
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    // Liga o domínio de produtos ao de carrinho sem dependência direta entre eles.
    { provide: CART_PORT, useExisting: CartStore },
  ],
};
