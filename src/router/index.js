import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth"; // Import the useAuth composable for authentication state

import PedidoUsuario from "../views/usuario/pedido/PedidoUsuario.vue";

import LoginUsuario from "../views/usuario/login/LoginUsuario.vue";
import LoginAdmin from "../views/admin/login/LoginAdmin.vue";

import GerenciarProdutos from "../views/admin/produtos/GerenciarProdutos.vue";
import CadastroProdutos from "../views/admin/produtos/CadastrarProdutos.vue";
import EditarProdutos from "../views/admin/produtos/EditarProdutos.vue";

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

import PainelAdministrativo from "../views/admin/PainelAdministrativo.vue";

import FullLayout from "../layout/FullLayout.vue";
import BlankLayout from "../layout/BlankLayout.vue";

import HistoricoPedidos from "../views/admin/historico/HistoricoPedidos.vue";
import DetalhePedidoHistorico from "../views/admin/historico/DetalhePedidoHistorico.vue";

const routes = [
  {
    path: "/",
    redirect: "/usuario/login", // Rota padrão redireciona para /usuario/login
  },
  {
    path: "/usuario",
    component: FullLayout,
    meta: { requiresAuthHospede: true }, // Exemplo de meta para proteger rotas de hóspede
    children: [{ path: "pedido", component: PedidoUsuario }],
  },
  {
    path: "/usuario/login",
    component: BlankLayout,
    children: [{ path: "", name: "HospedeLogin", component: LoginUsuario }],
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
      { path: "quarto/editar", component: EditarQuarto },
      { path: "refeicao", component: GerenciarCardapios },
      { path: "refeicao/cadastro", component: CadastroRefeicao },
      { path: "refeicao/editar/:id", component: EditarRefeicao },
      { path: "refeicao/cardapio/:id", component: EditarCardapioRefeicao },
      { path: "pedidos", component: GerenciarPedidos },
      { path: "pedidos/:id", component: RelatorioPedidos },
      { path: "pedidos/relatorio", component: RelatorioGeralPedidos },
      { path: "historico-pedidos", component: HistoricoPedidos },
      { path: "historico-pedidos/:id", component: DetalhePedidoHistorico },
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

  const isAdminLoginRoute = to.name === "AdminLogin";
  const isGuestLoginRoute = to.name === "HospedeLogin";

  const requiresAuthAdmin = to.matched.some(record => record.meta.requiresAuthAdmin);
  const requiresAuthGuest = to.matched.some(record => record.meta.requiresAuthHospede);

  // If trying to access admin login page while already admin authenticated, redirect to admin panel
  if (isAdminLoginRoute && authState.isAdminAuthenticated) {
    next({ path: "/admin" });
  }
  // If trying to access guest login page while already guest authenticated, redirect to guest area
  else if (isGuestLoginRoute && authState.isGuestAuthenticated) {
    next({ path: "/usuario/pedido" }); // Or your main guest authenticated route
  }
  // If route requires admin auth and admin is not authenticated, redirect to admin login
  else if (requiresAuthAdmin && !authState.isAdminAuthenticated) {
    next({ name: "AdminLogin" });
  }
  // If route requires guest auth and guest is not authenticated, redirect to guest login
  else if (requiresAuthGuest && !authState.isGuestAuthenticated) {
    next({ name: "HospedeLogin" });
  }
  // Otherwise, allow navigation
  else {
    next();
  }
});

export default router;
