import axios from 'axios';
import router from '../router';
import { useAuth } from '../composables/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
/**
 * Configura uma instância do Axios com a URL base e headers padrão.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Adiciona um interceptor para incluir o token de autenticação em todas as requisições,
 * se um token estiver disponível (ex: no localStorage).
 * Esta é uma forma comum de lidar com autenticação.
 */
apiClient.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    const { setAdminAuthenticated, setGuestAuthenticated, clearAllAuth } = useAuth();
    const currentRouteName = router.currentRoute.value.name;
    const isLoginRoute = ['AdminLogin', 'HospedeLogin'].includes(currentRouteName);

    if (error.response && error.response.status === 401) {
      console.warn('API returned 401 Unauthorized.');

      // Determine context and set appropriate auth state to false
      const currentPath = router.currentRoute.value.path;
      if (currentPath.startsWith('/admin')) {
        setAdminAuthenticated(false);
      } else if (currentPath.startsWith('/usuario')) { // Assuming '/usuario' is for guests
        setGuestAuthenticated(false);
      } else {
        // If context is unclear, or for any 401, ensure all auth flags are cleared
        // This might be too broad if you have other auth states. Adjust if needed.
        clearAllAuth(); 
      }
      
      if (!isLoginRoute) {
        // If NOT on a login page, this 401 is likely an expired session on a protected route.
        // Redirect to the appropriate login page.
        console.log(`401 on a protected route (${currentRouteName}). Redirecting to login.`);
        if (currentPath.startsWith('/admin')) {
          router.push({ name: 'AdminLogin' }).catch(err => console.error('Router push to AdminLogin error:', err));
        } else if (currentPath.startsWith('/usuario')) {
          router.push({ name: 'HospedeLogin' }).catch(err => console.error('Router push to HospedeLogin error:', err));
        } else {
          // Fallback redirect if context is very unclear (e.g., a route not starting with /admin or /usuario)
          router.push({ name: 'AdminLogin' }).catch(err => console.error('Router push to AdminLogin (fallback) error:', err));
        }
      } else {
        // If ON a login page (e.g., AdminLogin), a 401 means "invalid credentials".
        // Do NOT redirect here. Let the error propagate to the login component's catch block.
        // The login component will then display the specific message from the API (e.g., "Usuário ou senha inválidos.").
        console.log('401 on a login route. Error will propagate to component to display credentials error message.');
      }
    }
    // For all errors (including 401 on login page that needs to show a message, or other non-401 errors),
    // reject to allow downstream .catch() in services and components to handle.
    return Promise.reject(error);
  }
);

/**
 * Função genérica para tratar respostas e erros da API.
 * @param {Promise} requestPromise - A promessa da requisição Axios.
 * @returns {Promise<object>} Os dados da resposta.
 * @throws {object} O erro da API ou um erro genérico.
 */
const handleResponse = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data; 
  } catch (error) {
    // The 401 case on protected routes is now handled by the interceptor for redirection.
    // For 401s on login routes, the error is propagated.
    
    // Log general API errors here if not a 401 being handled for redirection
    if (!(error.response && error.response.status === 401 && !['AdminLogin', 'HospedeLogin'].includes(router.currentRoute.value.name))) {
        console.error('Erro na API (handleResponse):', error.response || error.message || error);
    }

    // Propagate the error so that the calling service/component can handle it.
    // If the API returns a JSON like { "message": "Usuário ou senha inválidos." },
    // error.response.data will be that object.
    if (error.response && error.response.data) {
      throw error.response.data; // This is what the service's catch block will receive as 'error'
    } else if (error.request && !(error.response && error.response.status === 401)) { // Avoid throwing generic network error if it was a 401 handled by interceptor
      throw { status: -1, message: 'Sem resposta do servidor. Verifique sua conexão.', errors: error.message };
    } else if (!(error.response && error.response.status === 401)) { // Avoid throwing generic client error if it was a 401
      throw { status: -2, message: error.message || 'Erro ao processar a requisição.', errors: {} };
    }
    // If it was a 401, it's either been redirected or will be propagated as error.response.data (or original error if no response.data)
    throw error; 
  }
};

/**
 * Funções base para requisições HTTP.
 */
const ApiServiceBase = {
  /**
   * Realiza uma requisição GET.
   * @param {string} endpoint - O caminho do endpoint (ex: '/usuarios').
   * @param {object} [params] - Parâmetros de query opcionais.
   * @returns {Promise<object>} Os dados da resposta.
   */
  get: (endpoint, params) => {
    return handleResponse(apiClient.get(endpoint, { params }));
  },

  /**
   * Realiza uma requisição POST.
   * @param {string} endpoint - O caminho do endpoint.
   * @param {object} data - O corpo da requisição.
   * @returns {Promise<object>} Os dados da resposta.
   */
  post: (endpoint, data) => {
    return handleResponse(apiClient.post(endpoint, data));
  },

  /**
   * Realiza uma requisição PUT.
   * @param {string} endpoint - O caminho do endpoint.
   * @param {object} data - O corpo da requisição.
   * @returns {Promise<object>} Os dados da resposta.
   */
  put: (endpoint, data) => {
    return handleResponse(apiClient.put(endpoint, data));
  },

  /**
   * Realiza uma requisição DELETE.
   * @param {string} endpoint - O caminho do endpoint.
   * @returns {Promise<object>} Os dados da resposta.
   */
  delete: (endpoint) => {
    return handleResponse(apiClient.delete(endpoint));
  },

  /**
   * Realiza uma requisição PATCH.
   * @param {string} endpoint - O caminho do endpoint.
   * @param {object} data - O corpo da requisição.
   * @returns {Promise<object>} Os dados da resposta.
   */
  patch: (endpoint, data) => {
    return handleResponse(apiClient.patch(endpoint, data));
  },

  // Você pode adicionar outros métodos HTTP conforme necessário (ex: HEAD, OPTIONS)
};

export default ApiServiceBase;