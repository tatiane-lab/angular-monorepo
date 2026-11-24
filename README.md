# Nx Angular Monorepo

> Nx · Angular 22 · NgRx SignalStore · arquitetura em camadas (feature / ui / data-access / util) · fronteiras de módulo com `enforce-module-boundaries`

Loja de demonstração construída como monorepo Nx para mostrar organização em camadas, tags de domínio e imports restritos entre bibliotecas. A API é simulada em memória, então o projeto roda sozinho, sem backend.

## Funcionalidades

- Catálogo de produtos com busca, filtro por categoria e ordenação (menor/maior preço, melhor avaliados)
- Detalhe do produto, com estado de estoque (esgotado / poucas unidades)
- Carrinho com quantidades, subtotal, persistência em `localStorage` e checkout simulado
- Estados de carregamento (skeleton), vazio, erro (com "tentar novamente") e 404
- Tema claro/escuro (respeita `prefers-color-scheme` e lembra a escolha)
- Layout responsivo e rotas carregadas sob demanda (lazy)

Não há login neste projeto, portanto não existem credenciais de demonstração.

## Estrutura do workspace

```
apps/
  shell/                  # app host (type:app, domain:shell): rotas, tema, mock da API
libs/
  feature-products/       # type:feature, domain:products  (lista, detalhe, rotas)
  feature-cart/           # type:feature, domain:cart      (página do carrinho, rotas)
  ui-components/          # type:ui, domain:shared         (button, card, badge, spinner, state-message)
  data-access-products/   # type:data-access, domain:products (service + ProductsStore)
  data-access-cart/       # type:data-access, domain:cart  (CartStore)
  util-common/            # type:util, domain:shared       (validators, formatação, datas, CART_PORT)
```

## Como rodar

```bash
npm install
npm start          # http://localhost:4210
npm run build      # build de produção em dist/apps/shell
npm test           # testes unitários (Vitest) das libs
npx nx graph       # grafo de dependências
```

## Regras de fronteira entre módulos

Aplicadas por `@nx/enforce-module-boundaries` em `.eslintrc.json`:

| Tag de origem | Pode depender de |
|---|---|
| `type:app` | feature, ui, data-access, util |
| `type:feature` | ui, data-access, util |
| `type:ui` | ui, util |
| `type:data-access` | data-access, util |
| `type:util` | util |

Tags de domínio restringem imports entre domínios: `products` não importa `cart` e vice-versa. O app (`domain:shell`) é o único que enxerga os dois.

## Decisões de arquitetura

- **Desacoplamento entre domínios com uma porta (`CART_PORT`)**: a lib de produtos precisa adicionar itens ao carrinho sem importar a lib do carrinho. O contrato fica em `util-common` (`CartPort`) e o app o liga ao `CartStore` em `app.config.ts`.
- **NgRx SignalStore** para estado (`ProductsStore`, `CartStore`), com `computed` para filtros, ordenação e totais.
- **Angular moderno**: componentes standalone, `input()`/`output()`, `OnPush`, control flow (`@if`/`@for`), `withComponentInputBinding` para o parâmetro `:id` e tipagem estrita.
- **API simulada** por um `HttpInterceptorFn` (`mock-api.interceptor.ts`): os serviços usam `HttpClient` normalmente; trocar por um backend real não exige mudar as libs.
- **Rotas lazy** por feature via `loadChildren`/`loadComponent`.
- **Design tokens** em CSS custom properties, com tema escuro por `data-theme`.
- O build usa o Angular CLI (`@angular/build`) orquestrado pelo Nx (cache de `build` e `test`). Module Federation não é usado: o app host carrega as features como rotas lazy no mesmo bundle.

## Stack

| Pacote | Versão |
|---|---|
| `nx` | ^22 |
| `@angular/*` | ~22.3 |
| `@ngrx/signals` | ^22 |
| `typescript` | ~6.0 |
| `vitest` | ^4 |

## CI

O GitHub Actions pode usar `nx affected` para executar apenas o que mudou:

```bash
npx nx affected -t build
npx nx affected -t test
```
