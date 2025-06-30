import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('[ApiService] Fazendo requisição:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: config.headers,
      params: config.params,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('[ApiService] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[ApiService] Resposta recebida:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[ApiService] Erro na resposta:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response && error.response.status === 401) {
      console.warn('API retornou 401 (Não Autorizado).');
    }
    return Promise.reject(error);
  }
);

const handleResponse = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error.response?.data?.message || error.response || error);
    if (error.response && error.response.data) {
      const apiError = new Error(error.response.data.message || 'Erro da API.');
      apiError.data = error.response.data;
      apiError.status = error.response.status;
      throw apiError;
    } else if (error.request) {
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