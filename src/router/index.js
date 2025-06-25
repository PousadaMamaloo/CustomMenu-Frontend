import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth"; // Import the useAuth composable for authentication state
import AuthService from "../services/AuthService";

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
import ComandaPorEventoHoje from '@/views/admin/pedidos/ComandaPorEventoHoje.vue';


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
      { path: "", component: PaineldeHospede },
      { path: "pedido", component: PedidoHospede },
      { path: "home", component: PaineldeHospede },
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
      { path: 'pedidos/comanda-hoje',
        name: 'ComandaDoDia',
        component: ComandaPorEventoHoje,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { path: "historico-pedidos", component: HistoricoPedidos },
      { 
        path: "historico-pedidos/:id", 
        name: "DetalhePedidoHistorico",
        component: () => import('@/views/admin/historico/DetalhePedidoHistorico.vue'),
        props: true
      },
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

router.beforeEach(async (to, from, next) => {
  const { authState, logout } = useAuth();

  const requiresAuthAdmin = to.matched.some(record => record.meta.requiresAuthAdmin);
  const requiresAuthGuest = to.matched.some(record => record.meta.requiresAuthHospede);

  // Se a rota requer autenticação, valida o token primeiro.
  if (requiresAuthAdmin || requiresAuthGuest) {
    const isTokenValid = await AuthService.validarToken();

    if (!isTokenValid) {
      logout(); // Limpa o estado de autenticação
      // Redireciona para a página de login apropriada.
      if (to.path.startsWith('/admin')) {
        return next({ name: 'AdminLogin' });
      }
      return next({ name: 'HospedeLogin' });
    }
  }

  // Redireciona usuários já logados para fora das páginas de login.
  if (to.name === 'AdminLogin' && authState.isAdminAuthenticated) {
    return next({ path: '/admin' });
  }
  if (to.name === 'HospedeLogin' && authState.isGuestAuthenticated) {
    return next({ path: '/hospede/home' });
  }

  // Protege as rotas se o usuário não estiver autenticado no estado local.
  if (requiresAuthAdmin && !authState.isAdminAuthenticated) {
    return next({ name: 'AdminLogin' });
  }
  if (requiresAuthGuest && !authState.isGuestAuthenticated) {
    return next({ name: 'HospedeLogin' });
  }

  // Se nenhuma regra de bloqueio for acionada, permite a navegação.
  next();
});

export default router;