# Nx Angular Monorepo

> Nx 20 · Angular 22 · Feature/UI/Data-access/Util Architecture · `enforce-module-boundaries` · Build Cache · `nx affected` CI

A production-grade Nx workspace demonstrating layered architecture, strict import boundaries, distributed caching, and per-remote CI deploys.

## Workspace Structure

```
nx-angular-monorepo/
├── apps/
│   ├── shell/              # Host application (tag: type:app, domain:shared)
│   ├── products-remote/    # Products MFE (tag: type:app, domain:products)
│   └── cart-remote/        # Cart MFE (tag: type:app, domain:cart)
└── libs/
    ├── feature-products/   # tags: type:feature, domain:products
    ├── feature-cart/       # tags: type:feature, domain:cart
    ├── ui-components/      # tags: type:ui, domain:shared
    ├── data-access-products/ # tags: type:data-access, domain:products
    ├── data-access-cart/   # tags: type:data-access, domain:cart
    └── util-common/        # tags: type:util, domain:shared
```

## Module Boundary Rules

Enforced by `@nx/enforce-module-boundaries` in `.eslintrc.json`:

| Source tag | May depend on |
|---|---|
| `type:app` | feature, ui, data-access, util |
| `type:feature` | ui, data-access, util |
| `type:ui` | ui, util |
| `type:data-access` | data-access, util |
| `type:util` | util only |

Domain tags additionally restrict cross-domain imports (products libs cannot import from cart libs).

## CI Pipeline

GitHub Actions runs `nx affected` to build/lint/test only what changed:

```bash
npx nx affected -t build --parallel=3
npx nx affected -t test --configuration=ci
npx nx affected -t lint
```

A matrix job deploys each remote independently on `main`.

## Tech Stack

| Package | Version |
|---|---|
| `nx` | ^20.0.0 |
| `@angular/core` | ^22.3.0 |
| `@ngrx/signals` | ^22.0.0 |
| `@angular-architects/native-federation` | ^19.0.0 |
