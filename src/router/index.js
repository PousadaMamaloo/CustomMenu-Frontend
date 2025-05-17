import { createRouter, createWebHistory } from 'vue-router'

import PedidoUsuario from '../views/usuario/pedido/PedidoUsuario.vue'
import LoginUsuario from '../views/usuario/login/LoginUsuario.vue'

import ProdutoAdmin from '../views/admin/produtos/ProdutosAdmin.vue'
import ProdutoCadastro from '../views/admin/produtos/ProdutosCadastro.vue'

import GerenciarQuartos from '../views/admin/quartos/GerenciarQuartos.vue'  
import CadastroQuarto from '../views/admin/quartos/CadastrarQuartos.vue'
import EditarQuarto from '../views/admin/quartos/EditarQuartos.vue'

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
        { path: 'produto/cadastro', component: ProdutoCadastro },
        { path: 'produto/editar/:id', component: ProdutoCadastro },
        { path: 'quarto', component: GerenciarQuartos },
        { path: 'quarto/cadastro', component: CadastroQuarto },
        { path: 'quarto/editar', component: EditarQuarto },
      ]
    }
  ]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router