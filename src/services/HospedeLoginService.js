import ApiServiceBase from './ApiServices';
import { useAuth } from '../composables/useAuth';

const GUEST_TOKEN_KEY = 'guest_auth_token';

/**
 * Service para gerenciar as operações da API relacionadas a Hóspedes.
 */
const HospedeService = {
  /**
   * Realiza o login do hóspede, armazena o token e atualiza o estado de autenticação.
   * @param {string} numQuarto - O número do quarto do hóspede.
   * @param {string} telefone - O telefone do hóspede.
   * @returns {Promise<object>} A resposta da API contendo o token.
   */
  async login(numQuarto, telefone) {
    const { setGuestAuthenticated } = useAuth();
    const payload = {
      num_quarto: numQuarto,
      telef_hospede: telefone,
    };

    try {
      console.log(payload);
      const response = await ApiServiceBase.post('/hospedes/login', payload);
      setGuestAuthenticated(true);
      return response;
    } catch (error) {
      setGuestAuthenticated(false);
      throw error; // Re-throw the error for the component to handle
    }
  },

  /**
   * Realiza o logout do hóspede, removendo o token e atualizando o estado.
   */
  logout() {
    const { setGuestAuthenticated } = useAuth();
    setGuestAuthenticated(false);
    // Here you could also call an API endpoint to invalidate the token on the server if one exists.
  },

  /**
   * Cadastra um novo hóspede no sistema. (Requer autenticação de admin)
   * @param {object} dadosHospede - Os dados do hóspede a ser cadastrado.
   * @returns {Promise<object>} O objeto do hóspede criado.
   */
  async cadastrarHospede(dadosHospede) {
    const response = await ApiServiceBase.post('/hospedes/cadastrar', dadosHospede);
    if (response && response.hospede) {
      return response.hospede;
    }
    return response;
  },

  /**
   * Lista todos os hóspedes existentes. (Requer autenticação de admin)
   * @returns {Promise<Array>} Uma lista de hóspedes.
   */
  async listarHospedes() {
    return await ApiServiceBase.get('/hospedes/listar');
  },

  /**
   * Busca um hóspede específico pelo seu ID. (Requer autenticação de admin)
   * @param {number} id - O ID do hóspede.
   * @returns {Promise<object>} O objeto do hóspede encontrado.
   */
  async buscarHospedePorId(id) {
    return await ApiServiceBase.get(`/hospedes/${id}`);
  },

  /**
   * Atualiza as informações de um hóspede. (Requer autenticação de admin)
   * @param {number} id - O ID do hóspede a ser atualizado.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarHospede(id, dadosAtualizacao) {
    return await ApiServiceBase.put(`/hospedes/${id}`, dadosAtualizacao);
  },

  /**
   * Deleta um hóspede. (Requer autenticação de admin)
   * @param {number} id - O ID do hóspede a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  async deletarHospede(id) {
    return await ApiServiceBase.delete(`/hospedes/${id}`);
  }
};

export default HospedeService;