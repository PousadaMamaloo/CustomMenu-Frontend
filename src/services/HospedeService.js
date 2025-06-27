import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a Hóspedes.
 */
const HospedeService = {
  /**
   * Realiza o login do hóspede.
   */
  async login(numQuarto, telefone) {
    const payload = {
      num_quarto: numQuarto,
      telef_hospede: telefone,
    };
    
    // Usar a rota correta conforme a documentação da API
    const response = await ApiServiceBase.post('/auth/login', payload);
    
    return response;
  },

  /**
   * Cadastra um novo hóspede (check-in).
   * @param {object} dadosHospede - { nome_hospede, telef_hospede, num_adultos, num_criancas, id_quarto }
   */
  async cadastrarHospede(dadosHospede) {
    return await ApiServiceBase.post('/hospedes/cadastrar', dadosHospede);
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
    return await ApiServiceBase.put(`/hospedes/${id}`, dadosAtualizacao);
  },

  /**
   * Deleta um hóspede (check-out).
   */
  async deletarHospede(id) {
    return await ApiServiceBase.delete(`/hospedes/${id}`);
  }
};

export default HospedeService;