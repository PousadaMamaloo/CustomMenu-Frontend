import axios from 'axios';
import { useToast } from 'vue-toastification';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const toast = useToast();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 segundos para APIs lentas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Só mostrar toast de sessão expirada se não for uma verificação de auth inicial
    if (error.response && error.response.status === 401) {
      const isAuthCheck = error.config.url.includes('/auth/validar_token');
      if (!isAuthCheck) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      }
    }
    return Promise.reject(error);
  }
);

const handleResponse = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const apiError = new Error(error.response.data.message || 'Erro da API.');
      apiError.data = error.response.data;
      apiError.status = error.response.status;
      throw apiError;
    } else if (error.request) {
      // Verificar se é timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('A requisição demorou muito para responder. Tente novamente.');
      }
      throw new Error('Sem resposta do servidor. Verifique sua conexão.');
    } else {
      throw error;
    }
  }
};

const ApiServiceBase = {
  get: (endpoint, params) => handleResponse(apiClient.get(endpoint, { params })),
  post: (endpoint, data) => handleResponse(apiClient.post(endpoint, data)),
  put: (endpoint, data) => handleResponse(apiClient.put(endpoint, data)),
  delete: (endpoint) => handleResponse(apiClient.delete(endpoint)),
  patch: (endpoint, data) => handleResponse(apiClient.patch(endpoint, data)),
};

export default ApiServiceBase;