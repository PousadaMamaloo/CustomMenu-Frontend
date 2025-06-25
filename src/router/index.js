import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth"; // Import the useAuth composable for authentication state

import PedidoHospede from "../views/hospede/pedido/PedidoHospede.vue";

import LoginHospede from "../views/hospede/login/LoginHospede.vue";
import LoginAdmin from "../views/admin/login/LoginAdmin.vue";

import GerenciarProdutos from "../views/admin/produtos/GerenciarProdutos.vue";
import CadastroProdutos from "../views/admin/produtos/CadastrarProdutos.vue";
import EditarProdutos from "../views/admin/produtos/EditarProdutos.vue";

import CadastroHospedes from "../views/admin/hospedes/CadastroHospedes.vue";
import GerenciarHospedes from "../views/admin/hospedes/GerenciarHospedes.vue";
import EditarHospede from "../views/admin/hospedes/EditarHospedes.vue";

import GerenciarQuartos from "../views/admin/quartos/GerenciarQuartos.vue";
import CadastroQuarto from "../views/admin/quartos/CadastrarQuartos.vue";
import EditarQuarto from "@/views/admin/quartos/EditarQuartos.vue";

import GerenciarCardapios from "../views/admin/cardapio/GerenciarCardapios.vue";
import CadastroRefeicao from "../views/admin/cardapio/CadastrarRefeicao.vue";
import EditarRefeicao from "../views/admin/cardapio/EditarRefeicao.vue";
import EditarCardapioRefeicao from "../views/admin/cardapio/EditarCardapioRefeicao.vue";

import GerenciarPedidos from "../views/admin/pedidos/GerenciarPedidos.vue";
import RelatorioPedidos from "../views/admin/pedidos/RelatorioPedidos.vue";
import RelatorioGeralPedidos from "../views/admin/pedidos/RelatorioGeralEvento.vue";
import ComandaPorEvento from '@/views/admin/pedidos/ComandaPorEvento.vue';


import PainelAdministrativo from "../views/admin/PainelAdministrativo.vue";
import PaineldeHospede from "../views/hospede/PaineldeHospede.vue";

import FullLayout from "../layout/FullLayout.vue";
import BlankLayout from "../layout/BlankLayout.vue";

import HistoricoPedidos from "../views/admin/historico/HistoricoPedidos.vue";
import DetalhePedidoHistorico from "../views/admin/historico/DetalhePedidoHistorico.vue";

const routes = [
  {
    path: "/",
    redirect: "/hospede/login", // Rota padrão redireciona para /hospede/login
  },
  {
    path: "/hospede",
    component: FullLayout,
    meta: { requiresAuthHospede: true }, // Exemplo de meta para proteger rotas de hóspede
    children: [
      { path: "pedido", component: PedidoHospede },
      { path: "", component: PaineldeHospede },
    ],
  },
  {
    path: "/hospede/login",
    component: BlankLayout,
    children: [{ path: "", name: "HospedeLogin", component: LoginHospede }],
  },
  {
    path: "/admin/login",
    component: BlankLayout,
    children: [{ path: "", name: "AdminLogin", component: LoginAdmin }],
  },
  {
    path: "/admin",
    component: FullLayout,
    meta: { requiresAuthAdmin: true }, // Meta para indicar que requer autenticação de admin
    children: [
      { path: "", component: PainelAdministrativo },
      { path: "produto", component: GerenciarProdutos },
      { path: "produto/editar/:id", component: EditarProdutos },
      { path: "produto/cadastro", component: CadastroProdutos },
      { path: "quarto", component: GerenciarQuartos },
      { path: "quarto/cadastro", component: CadastroQuarto },
      { path: "quarto/editar/:numero", component: EditarQuarto },
      { path: "refeicao", component: GerenciarCardapios },
      { path: "refeicao/cadastro", component: CadastroRefeicao },
      { path: "refeicao/editar/:id", component: EditarRefeicao },
      { path: "refeicao/cardapio/:id", component: EditarCardapioRefeicao },
      { path: "pedidos", component: GerenciarPedidos },
      { path: "pedidos/:id", component: RelatorioPedidos },
      { path: "pedidos/relatorio", component: RelatorioGeralPedidos },
      { path: "pedidos/comanda/:evento", name: "ComandaPorEvento", component: ComandaPorEvento  },
      { path: "historico-pedidos", component: HistoricoPedidos },
      { path: "historico-pedidos/:id", component: DetalhePedidoHistorico },
      { path: "hospedes", component: GerenciarHospedes },
      { path: "hospedes/cadastro", component: CadastroHospedes },
      { path: "hospedes/editar/:id", component: EditarHospede },
    ],
  },
  // Adicione uma rota de fallback ou página não encontrada, se desejar
  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { authState } = useAuth();

  const requiresAuthAdmin = to.matched.some(record => record.meta.requiresAuthAdmin);
  const requiresAuthGuest = to.matched.some(record => record.meta.requiresAuthHospede);

  // --- 1. Handle redirection for already authenticated users ---
  // If an authenticated admin tries to access the admin login page, redirect them to the dashboard.
  if (to.name === 'AdminLogin' && authState.isAdminAuthenticated) {
    return next({ path: '/admin' });
  }

  // If an authenticated guest tries to access the guest login page, redirect them to their main page.
  if (to.name === 'HospedeLogin' && authState.isGuestAuthenticated) {
    return next({ path: '/hospede/pedido' });
  }

  // --- 2. Handle route protection for unauthenticated users ---
  // If a route requires admin auth and the user is not an authenticated admin, redirect to admin login.
  if (requiresAuthAdmin && !authState.isAdminAuthenticated) {
    return next({ name: 'AdminLogin' });
  }

  // If a route requires guest auth and the user is not an authenticated guest, redirect to guest login.
  if (requiresAuthGuest && !authState.isGuestAuthenticated) {
    return next({ name: 'HospedeLogin' });
  }

  // --- 3. If no rules match, allow navigation ---
  next();
});

export default router;