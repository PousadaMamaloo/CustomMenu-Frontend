import ApiServiceBase from './ApiServices';
import { useAuth } from '../composables/useAuth';


/**
 * Service para gerenciar as operações da API relacionadas a Hóspedes.
 */
const HospedeService = {
  /**
   * Realiza o login do hóspede.
   * A função agora apenas faz a chamada à API e retorna a resposta.
   */
  async login(numQuarto, telefone) {
    // REMOVEMOS: const { setUser } = useAuth();

    const payload = {
      num_quarto: numQuarto,
      telef_hospede: telefone,
    };
    
    return ApiServiceBase.post('/auth/login', payload);
  },

  /**
   * Cadastra um novo hóspede (check-in).
   * @param {object} dadosHospede - { nome_hospede, telef_hospede, num_adultos, num_criancas, id_quarto }
   */
  async cadastrarHospede(dadosHospede) {
    return ApiServiceBase.post('/hospedes/cadastrar', dadosHospede);
  },

  /**
   * Lista todos os hóspedes existentes.
   */
  async listarHospedes() {
    const response = await ApiServiceBase.get('/hospedes/listar');
    return response.data || [];
  },

  /**
   * Busca um hóspede específico pelo seu ID.
   */
  async buscarHospedePorId(id) {
    const response = await ApiServiceBase.get(`/hospedes/${id}`);
    return response.data;
  },

  /**
   * Atualiza as informações de um hóspede.
   */
  async atualizarHospede(id, dadosAtualizacao) {
    return ApiServiceBase.put(`/hospedes/${id}`, dadosAtualizacao);
  },

  /**
   * Deleta um hóspede (check-out).
   */
  async deletarHospede(id) {
    return ApiServiceBase.delete(`/hospedes/${id}`);
  }
};

export default HospedeService;
