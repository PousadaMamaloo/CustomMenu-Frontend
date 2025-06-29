import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

const routes = [
  { path: "/", redirect: "/hospede/login" },
  { path: "/hospede/login", component: () => import("../layout/BlankLayout.vue"), children: [{ path: "", name: "HospedeLogin", component: () => import("../views/hospede/login/LoginHospede.vue") }] },
  { path: "/admin/login", component: () => import("../layout/BlankLayout.vue"), children: [{ path: "", name: "AdminLogin", component: () => import("../views/admin/login/LoginAdmin.vue") }] },
  {
    path: "/hospede",
    component: () => import("../layout/FullLayout.vue"),
    meta: { requiresAuth: true, role: 'guest' },
    children: [
      { path: "home", name: "HospedeHome", component: () => import("../views/hospede/PaineldeHospede.vue") },
      { path: "pedido", name: "HospedePedido", component: () => import("../views/hospede/pedido/PedidoHospede.vue") },
      { path: "", redirect: { name: 'HospedeHome' } },
    ],
  },
  {
    path: "/admin",
    component: () => import("../layout/FullLayout.vue"),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: "", name: "AdminDashboard", component: () => import("../views/admin/PainelAdministrativo.vue") },
      // ... todas as suas outras rotas de admin ...
      { path: "produto", name: "AdminGerenciarProdutos", component: () => import("../views/admin/produtos/GerenciarProdutos.vue") },
      { path: "produto/cadastro", name: "AdminCadastroProdutos", component: () => import("../views/admin/produtos/CadastrarProdutos.vue") },
      { path: "produto/editar/:id", name: "AdminEditarProdutos", component: () => import("../views/admin/produtos/EditarProdutos.vue") },
      { path: "quarto", name: "AdminGerenciarQuartos", component: () => import("../views/admin/quartos/GerenciarQuartos.vue") },
      { path: "quarto/cadastro", name: "AdminCadastroQuarto", component: () => import("../views/admin/quartos/CadastrarQuartos.vue") },
      { path: "quarto/editar/:numero", name: "AdminEditarQuarto", component: () => import("@/views/admin/quartos/EditarQuartos.vue") },
      { path: "refeicao", name: "AdminGerenciarCardapios", component: () => import("../views/admin/cardapio/GerenciarCardapios.vue") },
      { path: "refeicao/cadastro", name: "AdminCadastroRefeicao", component: () => import("../views/admin/cardapio/CadastrarRefeicao.vue") },
      { path: "refeicao/editar/:id", name: "AdminEditarRefeicao", component: () => import("../views/admin/cardapio/EditarRefeicao.vue") },
      { path: "refeicao/cardapio/:id", name: "AdminEditarCardapioRefeicao", component: () => import("../views/admin/cardapio/EditarCardapioRefeicao.vue") },
      { path: "pedidos", name: "AdminGerenciarPedidos", component: () => import("../views/admin/pedidos/GerenciarPedidos.vue") },
      { path: "pedidos/relatorio", name: "AdminRelatorioGeralPedidos", component: () => import("../views/admin/pedidos/RelatorioGeralEvento.vue") },
      { path: "pedidos/comanda-hoje", name: "AdminComandaPorEventoHoje", component: () => import('@/views/admin/pedidos/ComandaPorEventoHoje.vue')},
      { path: "pedidos/comanda/:evento", name: "AdminComandaPorEvento", component: () => import('@/views/admin/pedidos/ComandaPorEvento.vue') },
      { path: "pedidos/:id", name: "AdminRelatorioPedidos", component: () => import("../views/admin/pedidos/RelatorioPedidos.vue") },
      { path: "historico-pedidos", name: "AdminHistoricoPedidos", component: () => import("../views/admin/historico/HistoricoPedidos.vue") },
      { path: "historico-pedidos/:id", name: "AdminDetalhePedidoHistorico", component: () => import('@/views/admin/historico/DetalhePedidoHistorico.vue') },
      { path: "hospedes", name: "AdminGerenciarHospedes", component: () => import("../views/admin/hospedes/GerenciarHospedes.vue") },
      { path: "hospedes/cadastro", name: "AdminCadastroHospedes", component: () => import("../views/admin/hospedes/CadastroHospedes.vue") },
      { path: "hospedes/editar/:id", name: "AdminEditarHospede", component: () => import("../views/admin/hospedes/EditarHospedes.vue") },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import("../components/NotFound.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated, userType, authState } = useAuth();

  if (authState.isLoading) {
    return;
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.matched.find(record => record.meta.requiresAuth)?.meta.role;
  const isLoginPage = ['AdminLogin', 'HospedeLogin'].includes(to.name);

  // --- Caso 1: Usuário está logado ---
  if (isAuthenticated.value) {
    // Se tentar acessar uma página de login, redireciona para seu painel.
    if (isLoginPage) {
      return next({ name: userType.value === 'admin' ? 'AdminDashboard' : 'HospedeHome' });
    }

    // Se a rota precisa de uma permissão específica, mas o usuário não a tem.
    if (requiredRole && requiredRole !== userType.value) {
      const fallbackRoute = userType.value === 'admin' ? 'AdminDashboard' : 'HospedeHome';
      
      if (to.name === fallbackRoute) {
        return next();
      }
      return next({ name: fallbackRoute });
    }

    // Se tudo estiver OK, permite a navegação.
    return next();
  }

  // --- Caso 2: Usuário NÃO está logado ---
  if (!isAuthenticated.value) {
    // Se a rota exige autenticação, redireciona para o login correto.
    if (requiresAuth) {
      const loginRoute = requiredRole === 'admin' ? 'AdminLogin' : 'HospedeLogin';
      return next({ name: loginRoute, query: { redirect: to.fullPath } });
    }

    // Se a rota não exige autenticação (pública), permite.
    return next();
  }
});


export default router;
