import { reactive, readonly } from 'vue';
import router from '@/router'; // Import router for programmatic navigation if needed from here

const state = reactive({
  isAdminAuthenticated: false,
  isGuestAuthenticated: false,
  userInfo: null, // Informações do usuário logado
  userType: null, // 'admin' ou 'guest'
});

function setAdminAuthenticated(value, userInfo = null) {
  state.isAdminAuthenticated = value;
  if (value) {
    state.userType = 'admin';
    state.userInfo = userInfo;
  } else {
    state.userType = null;
    state.userInfo = null;
  }
}

function setGuestAuthenticated(value, userInfo = null) {
  state.isGuestAuthenticated = value;
  if (value) {
    state.userType = 'guest';
    state.userInfo = userInfo;
  } else {
    state.userType = null;
    state.userInfo = null;
  }
}

function logoutAdmin() {
  setAdminAuthenticated(false);
  
  // Chamar endpoint de logout do backend
  import('../services/AuthService').then(({ default: AuthService }) => {
    AuthService.logout().catch(err => console.warn('Erro ao fazer logout no backend:', err));
  });
  
  router.push({ name: 'AdminLogin' }).catch(err => console.error('Router push error:', err));
}

function logoutGuest() {
  setGuestAuthenticated(false);
  
  // Chamar endpoint de logout do backend
  import('../services/AuthService').then(({ default: AuthService }) => {
    AuthService.logout().catch(err => console.warn('Erro ao fazer logout no backend:', err));
  });
  
  router.push({ name: 'HospedeLogin' }).catch(err => console.error('Router push error:', err));
}

// General logout if context is unknown or to clear all
function logout() {
  clearAllAuth();
  
  // Chamar endpoint de logout do backend
  import('../services/AuthService').then(({ default: AuthService }) => {
    AuthService.logout().catch(err => console.warn('Erro ao fazer logout no backend:', err));
  });
  
  // Redireciona para a página inicial ou login
  router.push('/hospede/login').catch(err => console.error('Router push error:', err));
}

function clearAllAuth() {
  state.isAdminAuthenticated = false;
  state.isGuestAuthenticated = false;
  state.userInfo = null;
  state.userType = null;
}

// Função para inicializar o estado de autenticação na inicialização da app
async function initializeAuth() {
  try {
    // Importar o AuthService dinamicamente para evitar dependência circular
    const { default: AuthService } = await import('../services/AuthService');
    
    // Tentar obter informações do usuário (que já valida o token)
    const userInfo = await AuthService.obterUsuarioLogado();
    
    if (userInfo) {
      // Determinar o tipo de usuário baseado na resposta da API
      if (userInfo.tipo === 'administrador' || userInfo.tipo === 'admin') {
        state.isAdminAuthenticated = true;
        state.userType = 'admin';
        state.userInfo = userInfo;
      } else if (userInfo.tipo === 'hospede' || userInfo.tipo === 'guest') {
        state.isGuestAuthenticated = true;
        state.userType = 'guest';
        state.userInfo = userInfo;
      } else {
        // Tipo desconhecido, assume guest por padrão
        console.warn('Tipo de usuário desconhecido:', userInfo.tipo);
        state.isGuestAuthenticated = true;
        state.userType = 'guest';
        state.userInfo = userInfo;
      }
    }
    // Se não conseguir obter dados do usuário, permanece como não autenticado
  } catch (error) {
    console.warn('Erro ao validar token na inicialização:', error);
    // Em caso de erro, não faz nada (estado permanece como não autenticado)
  }
}

export function useAuth() {
  return {
    authState: readonly(state),
    setAdminAuthenticated,
    setGuestAuthenticated,
    logoutAdmin,
    logoutGuest,
    logout,
    clearAllAuth,
    initializeAuth,
  };
}