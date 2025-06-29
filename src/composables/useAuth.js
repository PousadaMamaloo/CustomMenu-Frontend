import { reactive, readonly, computed } from 'vue';
import router from '@/router';
import AuthService from '@/services/AuthService';

const state = reactive({
  user: null,
  isLoading: true, 
});

/**
 * Define o estado de autenticação. Chamado no login.
 * @param {object} userData - Dados do usuário vindos da API.
 */
function setUser(userData) {
  if (userData) {
    state.user = userData;
  }
}

/**
 * Limpa o estado de autenticação e redireciona.
 * @param {string} redirectToRoute - O nome da rota para redirecionar após o logout.
 */
async function logout(redirectToRoute) {
  try {
    await AuthService.logout();
  } catch (error) {
    if (error.status !== 401) {
       console.error('Ocorreu um erro inesperado ao tentar fazer logout no backend:', error);
    }
  } finally {
    // Esta parte, que limpa o estado e redireciona, executa sempre.
    state.user = null;
    router.push({ name: redirectToRoute }).catch(err => console.error('Router push error:', err));
  }
}
/**
 * Inicializa o estado de autenticação verificando o token no backend.
 */
async function initializeAuth() {
  state.isLoading = true;
  try {
    const userInfo = await AuthService.getAuthenticatedUser();
    if (userInfo) {
      state.user = userInfo;
    }
  } catch (error) {
    console.warn('Nenhuma sessão ativa encontrada ou erro na validação:', error);
    state.user = null;
  } finally {
    state.isLoading = false;
  }
}

export function useAuth() {
  return {
    authState: readonly(state),
    isAuthenticated: computed(() => !!state.user),
    userType: computed(() => state.user?.tipo || null), // Ex: 'admin' ou 'guest'
    isAdmin: computed(() => state.user?.tipo === 'admin'),
    isGuest: computed(() => state.user?.tipo === 'guest'),

    setUser,
    logout,
    initializeAuth,
  };
}
