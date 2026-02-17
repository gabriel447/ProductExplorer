# Product Explorer

Aplicação SPA em Vue 3 que consome uma API pública de produtos e implementa funcionalidades comuns do dia a dia de um desenvolvedor frontend, como listagem, busca, filtros, detalhes e um carrinho com persistência local.

## Instalação

```bash
npm install
```

## Ambiente de desenvolvimento

```bash
npm run dev
```

## Validação completa (lint + types + testes)

```bash
npm run validate
```

Esse comando executa, em sequência:

- npm run lint → ESLint + Oxlint
- npm run type-check → verificação de tipos com vue-tsc
- npm run test:unit -- --run → testes unitários com Vitest

## Decisões técnicas

As decisões abaixo resumem como os requisitos do desafio foram traduzidos em código.

- **Stack e organização**  
  Vue 3 com Composition API, Vue Router, Pinia, TypeScript e Vite. A estrutura é dividida em `views` (`HomeView.vue`, `ProductView.vue`), `components` (por exemplo, `ProductCard.vue`, `CartModal.vue`), `stores` (`productStore.ts`, `cartStore.ts`), `services` (`api.ts`) e `types` (`Product.ts`), mantendo responsabilidades separadas.

- **Catálogo, busca e filtros**  
  `HomeView.vue` orquestra o catálogo, renderizando um grid responsivo de cards (`ProductCard.vue`) com imagem, nome, preço, categoria e avaliação. A lógica de busca com debounce, filtro por categoria, ordenação por preço/avaliação e paginação fica centralizada na store de produtos (`productStore.ts`).

- **Detalhes do produto e navegação**  
  A rota dinâmica `/produto/:id` é definida em `router/index.ts` com lazy loading. `ProductView.vue` carrega o produto selecionado, utiliza `ProductDetails.vue`/`ProductSummary.vue` para exibir as informações e trata cenários de item inexistente com `NotFoundView.vue`.

- **Carrinho local**  
  A store `cartStore.ts` gerencia itens, quantidades, totais e persistência em `localStorage`. A interface do carrinho combina `CartButton.vue`, `CartModal.vue` e `CartInfo.vue` para permitir adicionar, remover e ajustar quantidades, exibindo o total da compra em tempo real.

- **API e tipagem**  
  `api.ts` centraliza chamadas para a Fake Store API usando Axios, com `baseURL` definida via `VITE_API_URL`. Os tipos `Product` e `Rating` em `Product.ts` seguem a estrutura real dos dados retornados pela API, garantindo segurança de tipos em toda a aplicação.

- **Estado, reatividade e qualidade**  
  A lógica de negócio fica nas stores, usando `ref` e `computed` para derivar filtros, páginas e totais, além de `watch` para debounce da busca e persistência do carrinho. A qualidade é reforçada por `npm run validate`, que executa lint, checagem de tipos e testes unitários (`api.spec.ts`, `productStore.spec.ts`, `cartStore.spec.ts`) em uma única etapa.

## Pontos de melhoria

- **Acessibilidade**  
  Reforçar atributos ARIA, navegação só por teclado, contraste de cores e definição de `lang="pt-BR"` no `index.html`, além de considerar `prefers-reduced-motion` para usuários sensíveis a animações.

- **Testes de interface**  
  Ampliar testes para componentes de UI (`HomeView`, `ProductView`, `ProductCard`, `CartModal`), cobrindo busca, filtros, ordenação, paginação, carrinho e mensagens de erro.

- **Experiência e comunicação de erro**  
  Melhorar feedback em falhas de rede (ações como “Tentar novamente”) e adicionar pequenos refinamentos de UX no carrinho, como confirmações visuais ao remover itens.

- **SEO básico**  
  Ajustar título e metadados no `index.html` para refletir “Product Explorer” e oferecer uma descrição melhor ao compartilhar a aplicação.

## Deploy

- Ambiente de produção (Vercel): https://product-explorer-rosy.vercel.app
