import { createRouter, createWebHistory } from 'vue-router'

import PedidoUsuario from '../views/usuario/pedido/PedidoUsuario.vue'
import LoginUsuario from '../views/usuario/login/LoginUsuario.vue'

import GerenciarProdutos from '../views/admin/produtos/GerenciarProdutos.vue'
import CadastroProdutos from '../views/admin/produtos/CadastrarProdutos.vue'
import EditarProdutos from '../views/admin/produtos/EditarProdutos.vue'

import GerenciarQuartos from '../views/admin/quartos/GerenciarQuartos.vue'  
import CadastroQuarto from '../views/admin/quartos/CadastrarQuartos.vue'
import EditarQuarto from '../views/admin/quartos/EditarQuartos.vue'

import PainelAdministrativo from '../views/admin/PainelAdministrativo.vue'

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
        { path: '', component: PainelAdministrativo },
        { path: 'produto', component: GerenciarProdutos },
        { path: 'produto/editar/:id', component: EditarProdutos },
        { path: 'produto/cadastro', component: CadastroProdutos },
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