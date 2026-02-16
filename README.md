# Product Explorer

## Como rodar o projeto

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Validação completa (lint + types + testes)

```bash
npm run validate
```

Esse comando executa, em sequência:

- `npm run lint` → ESLint + Oxlint
- `npm run type-check` → verificação de tipos com `vue-tsc`
- `npm run test:unit -- --run` → testes unitários com Vitest

---

## Decisões técnicas

- **Stack**
  - Vue 3 + Composition API (`<script setup>`)
  - TypeScript de ponta a ponta (views, stores, serviços e tipos)
  - Pinia (estado global), Axios (HTTP), Vue Router (rotas), Vitest/ESLint/Oxlint/vue-tsc (qualidade)

- **Arquitetura**
  - Camadas: `views/`, `components/`, `stores/`, `services/`, `types/`
  - Principais arquivos: HomeView.vue, ProductView.vue, NotFoundView.vue
  - Componentização: ProductCard.vue, ProductDetails.vue, CartModal.vue, CartInfo.vue, CartButton.vue

- **Estado**
  - productStore.ts: carrega catálogo, aplica busca/filtro/ordenar/paginar e expõe `filteredProducts`, `displayedProducts`, `totalPages`
  - cartStore.ts: gerencia itens, totais e persiste automaticamente no `localStorage`

- **API**
  - Axios com `baseURL` configurável (`VITE_API_URL`) e `timeout`
  - api.ts com `getProducts()` e `getProductById(id)` no domínio de produtos
  - `ensureConfigured()` protege contra execução sem configuração de ambiente

- **Roteamento**
  - Rotas: `/` (Home), `/produto/:id` (Detalhes), `/404` (NotFound)
  - Lazy loading das views para reduzir o bundle inicial
  - Arquivo: router/index.ts

- **Catálogo (UX)**
  - Busca com debounce de 300ms
  - Filtro por categoria derivada dos dados
  - Ordenação por preço (asc/desc) e por avaliação (nota/contagem)
  - Paginação via `limit` e `page` no store

- **Carrinho**
  - Persistência em `localStorage`, remoção/adição/quantidade e totais reativos

- **Qualidade**
  - Lint (ESLint + Oxlint), type-check (vue-tsc) e testes unitários (Vitest)
  - Cobertura: productStore.ts, cartStore.ts, services/api.ts

---

## Pontos de melhoria

- **Refatorar `HomeView` em subcomponentes**
  - A view de catálogo concentra lógica de busca, filtros, ordenação, paginação e carrinho.
  - É possível extrair componentes como `SearchBar`, `FilterBar`, `SortDropdown` e `Pagination` para deixar o código ainda mais modular.

- **Mais testes focados em UI**
  - Atualmente os testes estão focados em stores e serviços.
  - Pode-se adicionar testes de componentes (ex.: `HomeView`, `ProductView`) com `@vue/test-utils` para validar interações de interface.

- **Acessibilidade**
  - Melhorar suporte para leitores de tela (por exemplo, usuários cegos), garantindo textos alternativos mais descritivos, foco bem definido e uso consistente de atributos ARIA.
