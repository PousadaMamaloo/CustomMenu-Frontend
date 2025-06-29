import ApiServiceBase from './ApiServices';

const AdministradorLoginService = {
  /**
   * Realiza o login do administrador.
   * @param {string} usuario - O nome de usuário.
   * @param {string} senha - A senha.
   * @returns {Promise<object>} A resposta da API em caso de sucesso.
   * @throws {Error} Um erro se a chamada da API falhar.
   */
  async login(usuario, senha) {
    const payload = {
      usuario: usuario,
      senha: senha,
    };
    
    return ApiServiceBase.post('/administrador/login', payload);
  },
};

export default AdministradorLoginService;
