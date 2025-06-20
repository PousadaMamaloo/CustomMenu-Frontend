import ApiServiceBase from './ApiServices';
import { useAuth } from '../composables/useAuth';

const AdministradorLoginService = {
  /**
   * Realiza o login do administrador e atualiza o estado de autenticação.
   * @param {string} usuario - O nome de usuário/login do administrador.
   * @param {string} senha - A senha do administrador.
   * @returns {Promise<object>} A resposta da API (o objeto JSON completo da resposta bem-sucedida).
   * @throws {object} Um objeto de erro processado com uma propriedade 'message' amigável.
   */
  async login(usuario, senha) {
    const { setAdminAuthenticated } = useAuth(); // Correctly scoped call to useAuth

    const payload = {
      usuario: usuario,
      senha: senha,
    };

    try {
      const responseData = await ApiServiceBase.post('/administrador/login', payload);
      setAdminAuthenticated(true);
      console.log('Login bem-sucedido e estado de autenticação atualizado (service). Mensagem da API:', responseData?.message);
      return responseData;
    } catch (error) {
      setAdminAuthenticated(false);
      console.error('Falha no processo de login (AdministradorLoginService), erro original recebido:', error);

      let processedError = {
        message: 'Ocorreu uma falha ao tentar fazer login. Verifique suas credenciais ou tente novamente mais tarde.',
        status: null,
        originalData: error
      };

      if (error && typeof error === 'object' && error.message) {
        // Use the message directly from the error object if ApiServiceBase provided it
        // This should contain "Usuário ou senha inválidos." if that's what the API returned for a 401/400
        processedError.message = error.message;
        if (error.status) { // If ApiServiceBase added a custom status (e.g., for network errors)
          processedError.status = error.status;
        }
      } else if (typeof error === 'string') {
        processedError.message = error;
      }
      
      console.error('Mensagem de erro processada para o componente (AdministradorLoginService):', processedError.message);
      throw processedError;
    }
  },
};



export default AdministradorLoginService;