import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/HomePage.vue'),
      meta: {
        layout: 'BaseLayout',
      },
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('../views/Example/ExampleIndex.vue'),
      meta: {
        layout: 'BaseLayout',
      },
      children: [
        {
          path: 'pie',
          name: 'pie',
          component: () => import('@/views/Example/PieChart.vue'),
        },
        {
          path: 'scatterPlot',
          name: 'scatterPlot',
          component: () => import('@/views/Example/ScatterPlot.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      redirect: { name: 'index' },
    },
  ],
})

export default router
