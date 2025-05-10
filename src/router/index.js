import { createRouter, createWebHistory } from 'vue-router'

import PedidoUsuario from '../views/usuario/pedido/PedidoUsuario.vue'
import LoginUsuario from '../views/usuario/login/LoginUsuario.vue'

import ProdutoAdmin from '../views/admin/produtos/ProdutosAdmin.vue'

import FullLayout from '../layout/FullLayout.vue'
import BlankLayout from '../layout/BlankLayout.vue'

const routes = [
    {
      path: '/usuario',
      component: FullLayout,
      children: [
        { path: 'pedido', component: PedidoUsuario },
      ],
    },
    {
      path: '/usuario/login',
      component: BlankLayout,
      children: [
        { path: '', component: LoginUsuario }
      ]
    },
    {
      path: '/admin',
      component: FullLayout,
      children: [
        { path: 'produto', component: ProdutoAdmin },
      ]
    }
  ]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router