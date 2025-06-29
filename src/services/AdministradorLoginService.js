import ApiServiceBase from './ApiServices';
// Importa a função correta do nosso composable otimizado
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
    const { setUser } = useAuth();

    const payload = {
      usuario: usuario,
      senha: senha,
    };

    try {
      const responseData = await ApiServiceBase.post('/administrador/login', payload);
      
      const userInfo = responseData.data.usuario;
      
      if (userInfo) {
        setUser(userInfo);
      } else {
        throw new Error("Resposta de login bem-sucedida, mas sem dados do usuário.");
      }
      
      return responseData;

    } catch (error) {
      let processedError = {
        message: 'Ocorreu uma falha ao tentar fazer login. Verifique suas credenciais ou tente novamente mais tarde.',
        status: null,
        originalData: error
      };

      if (error && typeof error === 'object' && error.message) {
        processedError.message = error.message;
        if (error.status) {
          processedError.status = error.status;
        }
      } else if (typeof error === 'string') {
        processedError.message = error;
      }
      
      throw processedError;
    }
  },
};

export default AdministradorLoginService;
