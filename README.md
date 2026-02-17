# Product Explorer

Aplicação SPA em Vue 3 que consome uma API pública de produtos e implementa funcionalidades comuns do dia a dia de um desenvolvedor frontend, como listagem, busca, filtros, detalhes e um carrinho com persistência local.

## Instalação

```bash
npm install
```

## Configuração de ambiente

Crie um arquivo `.env` na raiz do projeto definindo a variável de ambiente utilizada pelo serviço de API:

```bash
VITE_API_URL=<sua_url_de_api>
```

Essa URL será usada tanto em desenvolvimento quanto em produção.

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
  Vue 3 com Composition API, Vue Router, Pinia, TypeScript e Vite. A estrutura é dividida em `views` (`HomeView.vue`, `ProductView.vue`), `components` (`ProductCard.vue`, `CartModal.vue`), `stores` (`productStore.ts`, `cartStore.ts`), `services` (`api.ts`) e `types` (`Product.ts`), mantendo responsabilidades separadas.

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

- **Acessibilidade (pessoas com deficiência)**  
  Aprimorar suporte para pessoas com deficiência visual, auditiva ou motora, reforçando atributos ARIA, navegação só por teclado, contraste de cores adequado e respeito à preferência de redução de movimento para usuários sensíveis a animações.

- **Testes de interface**  
  Ampliar testes para componentes de UI (`HomeView`, `ProductView`, `ProductCard`, `CartModal`), cobrindo busca, filtros, ordenação, paginação, carrinho e mensagens de erro.

- **Feedback de ações do usuário**  
  A aplicação já exibe feedback em pontos-chave (por exemplo, página de 404 quando o produto não existe ou a API não responde, e mensagem ao adicionar itens ao carrinho). Uma melhoria natural seria ampliar esse padrão para mais ações, como remover ou atualizar itens, outros erros de rede e avisos importantes, deixando o comportamento ainda mais transparente para o usuário.

- **Componentização ainda mais fina**  
  Alguns trechos de layout e trechos de lógica visual podem ser extraídos em componentes menores e mais reutilizáveis, o que facilitaria manutenção, testes e reaproveitamento em novas telas (por exemplo, componentes específicos para filtros, listagem vazia ou estados de carregamento/erro).

## Deploy

- Ambiente de produção (Vercel): https://product-explorer-rosy.vercel.app
- Roteamento em produção: o projeto inclui um arquivo `vercel.json` na raiz que reescreve todas as rotas para `index.html`, garantindo que URLs como `/produto/:id` possam ser acessadas diretamente e compartilhadas sem gerar 404 da Vercel.
