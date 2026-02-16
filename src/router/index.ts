import { createRouter, createWebHistory } from 'vue-router'
// Configuração de rotas
// Responsabilidades: definir rotas, lazy loading e props dinâmicas

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/produto/:id',
      name: 'product-details',
      component: () => import('../views/ProductView.vue'),
      props: true,
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
