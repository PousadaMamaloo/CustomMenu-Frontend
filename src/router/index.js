import { createRouter, createWebHistory } from 'vue-router'

import PedidoUsuario from '../views/usuario/pedido/PedidoUsuario.vue'
import LoginUsuario from '../views/usuario/login/LoginUsuario.vue'
// import LoginAdmin from '@/views/admin/login/LoginAdmin.vue'
// import ProdutosAdmin from '@/views/admin/produtos/ProdutosAdmin.vue'


import FullLayout from '../layout/FullLayout.vue'
import BlankLayout from '../layout/BlankLayout.vue'

const routes = [
    {
      path: '/usuario',
      component: FullLayout,
      children: [
        { path: 'pedido', component: PedidoUsuario },
        { path: 'historico/:id', component: () => import('../views/usuario/historico/HistoricoPedidos.vue') },
      ],
    },
    {
      path: '/usuario/login',
      component: BlankLayout,
      children: [
        { path: '', component: LoginUsuario }
      ]
    },
  ]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router