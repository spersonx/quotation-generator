import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: () => import('@/views/EditorView.vue')
    },
    {
      path: '/preview/:id',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue')
    }
  ]
})

export default router
