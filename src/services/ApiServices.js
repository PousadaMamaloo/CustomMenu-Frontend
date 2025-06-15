import axios from 'axios';

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
    // Tenta obter o token de administrador ou de hóspede
    // A lógica exata de qual token usar pode precisar ser mais sofisticada
    // dependendo do contexto da requisição.
    const adminToken = localStorage.getItem('adminToken');
    const hospedeToken = localStorage.getItem('hospedeToken');
    let token = null;

    // Priorize o token de admin se ambos existirem, ou ajuste conforme necessário
    if (adminToken) {
      token = adminToken;
    } else if (hospedeToken) {
      token = hospedeToken;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
    return response.data; // Retorna apenas os dados da resposta
  } catch (error) {
    console.error('Erro na API:', error.response || error.message || error);
    if (error.response && error.response.data) {
      console.log(error);
      // Se o servidor retornou um erro estruturado (ex: { status, message, errors })
      throw error.response.data;
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw { status: -1, message: 'Sem resposta do servidor. Verifique sua conexão.', errors: error.message };
    } else {
      // Algo aconteceu ao configurar a requisição que acionou um erro
      throw { status: -2, message: error.message || 'Erro ao processar a requisição.', errors: {} };
    }
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
    console.log("NEGAO - ENDPOINT: ", API_BASE_URL, endpoint)
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