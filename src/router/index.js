import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Só verifica auth se ainda está carregando
  if (authStore.isLoading) {
    try {
      await authStore.checkAuth();
    } catch (error) {
      console.warn('Erro na verificação de autenticação:', error);
      // Continue mesmo com erro de auth para permitir acesso às páginas públicas
    }
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole;
  const requiredRole = to.meta.role;
  const isLoginPage = ['AdminLogin', 'HospedeLogin'].includes(to.name);

  // Se estiver autenticado
  if (isAuthenticated) {
    // Verificar se o role é válido
    if (userRole !== 'admin' && userRole !== 'guest') {
      await authStore.logout();
      return next({ name: 'HospedeLogin' }); 
    }

    const userHome = userRole === 'admin' ? { name: 'AdminDashboard' } : { name: 'HospedeHome' };

    // Se está tentando acessar página de login, redireciona para home
    if (isLoginPage) {
      return next(userHome);
    }
    
    // Se a rota requer um role específico e não corresponde
    if (requiredRole && requiredRole !== userRole) {
      return next(userHome);
    }

    // Usuário autenticado pode prosseguir
    return next();
  }

  // Se não estiver autenticado e a rota requer autenticação
  if (to.meta.requiresAuth) {
    const loginRoute = requiredRole === 'admin' ? 'AdminLogin' : 'HospedeLogin';
    return next({ name: loginRoute, query: { redirect: to.fullPath } });
  }
  
  // Rota não requer auth, pode prosseguir
  return next();
});

export default router;