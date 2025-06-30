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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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