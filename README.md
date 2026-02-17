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

As escolhas abaixo foram feitas para construir um catálogo de produtos em SPA que fosse simples de usar para o usuário final e, ao mesmo tempo, fácil de evoluir e manter do ponto de vista de frontend.

- **Arquitetura e tecnologias**  
  A aplicação foi estruturada em torno de Vue 3 com Composition API, Vue Router, Pinia, TypeScript e Vite. O código é organizado em camadas claras: `views` para telas (por exemplo, `src/views/HomeView.vue` e `src/views/ProductView.vue`), `components` para blocos reutilizáveis de interface (como `src/components/ProductCard.vue` e `src/components/CartModal.vue`), `stores` para estado global (`src/stores/productStore.ts` e `src/stores/cartStore.ts`), `services` para acesso HTTP (`src/services/api.ts`) e `types` para os modelos de domínio (`src/types/Product.ts`). Essa divisão facilita entender onde cada parte da lógica vive e permite crescer o projeto sem virar um arquivo único com tudo misturado.

- **Catálogo, busca e filtros**  
  O catálogo foi pensado como a experiência principal. A tela inicial (`HomeView.vue`) exibe os produtos em um grid responsivo com imagem, nome, preço, categoria e avaliação, utilizando o componente de card `ProductCard.vue` para isolar a responsabilidade de apresentação. Em cima disso, a tela oferece busca por nome com debounce, filtro por categoria e ordenação configurável (preço crescente/decrescente e melhores avaliações). Toda essa lógica de filtro, ordenação e paginação é calculada de forma reativa na store de produtos (`productStore.ts`), reduzindo acoplamento nas views.

- **Detalhes do produto e navegação**  
  Para permitir que cada produto tenha uma URL própria, foi criada uma rota dinâmica `/produto/:id` na configuração de rotas (`src/router/index.ts`), carregada de forma lazy. A view de detalhes (`ProductView.vue`) busca o item correspondente, exibe todas as informações relevantes utilizando o componente `ProductDetails.vue` (que por sua vez compõe `ProductSummary.vue`) e expõe ações de voltar para o catálogo e abrir o carrinho. Quando o ID não existe ou a busca falha, é exibida a view `NotFoundView.vue`, evitando estados quebrados.

- **Carrinho e persistência local**  
  O carrinho foi modelado como uma store independente (`cartStore.ts`), responsável por adicionar produtos, remover itens, alterar quantidades e calcular totais. A interface do carrinho é composta por um botão flutuante (`CartButton.vue`), um modal com a lista de itens (`CartModal.vue`) e componentes específicos para cada linha do carrinho (`CartInfo.vue`). As informações são mantidas entre sessões utilizando `localStorage`, com uma rotina de carga inicial e um observador que salva as mudanças sempre que o estado é atualizado.

- **Comunicação com a API e tipagem**  
  A comunicação com a Fake Store API foi centralizada em um serviço dedicado (`src/services/api.ts`), que encapsula a instância do Axios e expõe funções específicas para listar produtos e obter detalhes por ID. O endereço base da API é configurado por variável de ambiente (`VITE_API_URL`), permitindo apontar para diferentes ambientes sem alterar código. Os modelos `Product` e `Rating` em `src/types/Product.ts` seguem a estrutura real dos dados retornados, garantindo segurança de tipos em toda a aplicação.

- **Estado global e reatividade**  
  Em vez de espalhar estados locais pelas telas, as informações de catálogo e carrinho ficam nas stores do Pinia (`productStore.ts` e `cartStore.ts`). A partir delas são derivados valores computados como lista filtrada, páginas, totais de itens e total em dinheiro. A busca por nome em `HomeView.vue` usa um `watch` com atraso para evitar recomputar o filtro a cada tecla, enquanto o carrinho utiliza um `watch` profundo para persistir o estado no armazenamento local. Isso aproveita bem o modelo reativo do Vue e mantém a lógica de negócio centrada em um único lugar.

- **Qualidade e testes**  
  Para garantir que as principais regras continuem funcionando à medida que o código evolui, foram escritos testes unitários cobrindo o serviço de API (`src/services/__tests__/api.spec.ts`), a store de produtos (`src/stores/__tests__/productStore.spec.ts`) e a store de carrinho (`src/stores/__tests__/cartStore.spec.ts`). O fluxo de validação do projeto passa por lint, checagem de tipos com `vue-tsc` e testes com Vitest através de um único comando de conveniência (`npm run validate`), o que incentiva rodar tudo antes de entregar mudanças.

## Pontos de melhoria

- **Acessibilidade para pessoas com deficiência**  
  Apesar de já existirem alguns atributos ARIA (por exemplo, `role="status"`, `aria-live="polite"`, `aria-label` em botões e campos), é possível avançar mais em acessibilidade:
  - Definir o atributo `lang="pt-BR"` no `index.html` para auxiliar leitores de tela.
  - Reforçar a navegação totalmente por teclado (foco visível consistente em todos os controles interativos, inclusive dentro de modais).
  - Revisar contraste de cores sob as diretrizes WCAG e garantir textos suficientemente legíveis em todos os estados (hover, focus, disabled).
  - Adicionar landmarks ARIA (por exemplo, `main`, `header`, `nav`) para estruturar melhor a página para tecnologias assistivas.
  - Considerar suporte a `prefers-reduced-motion` para reduzir animações (como spinners e toasts) para usuários sensíveis a movimento.

- **Cobertura de testes em componentes de UI**  
  A maior parte dos testes se concentra em stores e serviços. Há espaço para adicionar testes de componentes (por exemplo, `HomeView`, `ProductView`, `ProductCard`, `CartModal`) validando comportamentos de busca, filtros, ordenação, paginação, abertura/fechamento do carrinho e mensagens de erro.

- **Mensagens de erro e estados de rede**  
  Detalhar mais o feedback ao usuário em casos de falha de rede ou API indisponível, com ações claras como “Tentar novamente” e, eventualmente, algum fallback offline simples.

- **Melhorias de UX no carrinho**  
  Poderiam ser adicionadas pequenas melhorias, como confirmação visual ao remover itens, mensagem de sucesso mais destacada ao finalizar uma compra fictícia ou um resumo fixo do total em telas menores.

- **SEO, metadados e título da página**  
  Ajustar o título padrão do `index.html` para refletir o nome da aplicação (por exemplo, “Product Explorer”) e incluir metatags descritivas. Isso melhora tanto o SEO quanto a apresentação da aplicação quando compartilhada.

## Deploy

- Ambiente de produção (Vercel): **adicione aqui o link da sua URL pública**
