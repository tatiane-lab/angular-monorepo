import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, mergeMap, of, throwError } from 'rxjs';
import type { Product } from '@nx-angular-monorepo/data-access-products';

function art(emoji: string, from: string, to: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="400" height="300" fill="url(#g)"/><text x="200" y="170" font-size="110" text-anchor="middle">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Teclado Mecânico Aurora', description: 'Teclado mecânico 75% com switches silenciosos, iluminação RGB e conexão sem fio.', price: 459.9, category: 'Periféricos', imageUrl: art('⌨️', '#6366f1', '#a855f7'), stock: 12, rating: 4.8, reviewCount: 214 },
  { id: 'p2', name: 'Mouse Ergonômico Vertical', description: 'Mouse vertical que reduz a tensão no pulso, sensor de 4000 DPI e bateria de longa duração.', price: 229, category: 'Periféricos', imageUrl: art('🖱️', '#0ea5e9', '#6366f1'), stock: 3, rating: 4.5, reviewCount: 98 },
  { id: 'p3', name: 'Monitor Ultrawide 34"', description: 'Painel IPS ultrawide QHD de 144 Hz, ideal para programação e edição.', price: 3299, category: 'Monitores', imageUrl: art('🖥️', '#14b8a6', '#0ea5e9'), stock: 6, rating: 4.9, reviewCount: 57 },
  { id: 'p4', name: 'Monitor Portátil 15,6"', description: 'Segunda tela USB-C leve e fina, perfeita para quem trabalha em movimento.', price: 1149.5, category: 'Monitores', imageUrl: art('📺', '#f59e0b', '#ef4444'), stock: 0, rating: 4.2, reviewCount: 31 },
  { id: 'p5', name: 'Headset Cancelamento de Ruído', description: 'Headset sem fio com cancelamento ativo de ruído e 40 horas de bateria.', price: 899, category: 'Áudio', imageUrl: art('🎧', '#ec4899', '#8b5cf6'), stock: 20, rating: 4.7, reviewCount: 340 },
  { id: 'p6', name: 'Caixa de Som Bluetooth', description: 'Caixa portátil resistente à água com graves potentes e 12 horas de música.', price: 349.9, category: 'Áudio', imageUrl: art('🔊', '#22c55e', '#14b8a6'), stock: 25, rating: 4.4, reviewCount: 126 },
  { id: 'p7', name: 'Webcam Full HD', description: 'Webcam 1080p com foco automático, microfone duplo e tampa de privacidade.', price: 279, category: 'Periféricos', imageUrl: art('📷', '#64748b', '#334155'), stock: 9, rating: 4.3, reviewCount: 73 },
  { id: 'p8', name: 'Notebook Slim 14"', description: 'Notebook leve com 16 GB de RAM, SSD de 512 GB e bateria para o dia inteiro.', price: 5890, category: 'Computadores', imageUrl: art('💻', '#4f46e5', '#0ea5e9'), stock: 4, rating: 4.6, reviewCount: 189 },
  { id: 'p9', name: 'Hub USB-C 8 em 1', description: 'Hub com HDMI 4K, leitor de cartão, USB 3.0 e carregamento de 100 W.', price: 299.9, category: 'Acessórios', imageUrl: art('🔌', '#f97316', '#f43f5e'), stock: 40, rating: 4.1, reviewCount: 64 },
  { id: 'p10', name: 'Cadeira Ergonômica Pro', description: 'Cadeira com ajuste lombar, apoio de braço 4D e encosto em tela respirável.', price: 1799, category: 'Acessórios', imageUrl: art('🪑', '#84cc16', '#22c55e'), stock: 5, rating: 4.8, reviewCount: 412 },
];

/** Simula a API REST (`/api/products`) em memória, com latência artificial. */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url, 'http://local');
  if (req.method !== 'GET' || !url.pathname.startsWith('/api/products')) {
    return next(req);
  }

  const id = url.pathname.split('/')[3];
  const body = id ? PRODUCTS.find((p) => p.id === id) : PRODUCTS;

  return of(null).pipe(
    delay(600),
    mergeMap(() =>
      body
        ? of(new HttpResponse({ status: 200, body }))
        : throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Não encontrado', url: req.url })),
    ),
  );
};
