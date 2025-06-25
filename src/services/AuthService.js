import ApiServiceBase from './ApiServices';

const AuthService = {
  /**
   * Valida o token de autenticação atual no backend.
   * @returns {Promise<boolean>} True se o token for válido, false caso contrário.
   */
  async validarToken() {
    try {
      // O ApiServiceBase já deve enviar o token automaticamente no header.
      // Se a requisição for bem-sucedida (status 2xx), o token é válido.
      await ApiServiceBase.get('/auth/validar_token');
      return true;
    } catch (error) {
      // Se a API retornar um erro (401, 403, etc.), o token é inválido.
      console.error('Falha na validação do token:', error);
      return false;
    }
  }
};

export default AuthService;
