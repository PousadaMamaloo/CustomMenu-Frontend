import ApiServiceBase from './ApiServices'; // Certifique-se que o nome do arquivo está correto

const AdministradorLoginService = {
  /**
   * Realiza o login do administrador.
   * @param {string} usuario - O nome de usuário/login do administrador.
   * @param {string} senha - A senha do administrador.
   * @returns {Promise<object>} A resposta da API (o objeto JSON completo).
   * @throws {object} O erro da API, conforme tratado pelo ApiServiceBase.
   */
  async login(usuario, senha) {
    const payload = {
      usuario: usuario,
      senha: senha,
    };

    try {
      // ApiServiceBase.post já retorna response.data
      // e lida com o console.error em caso de falha na requisição HTTP
      const responseData = await ApiServiceBase.post('/administrador/login', payload);

      // Verifica a estrutura da resposta de sucesso esperada
      if (responseData && responseData.status === 200 && responseData.data && responseData.data.token) {
        console.log('Login bem-sucedido:', responseData.message);
        localStorage.setItem('adminToken', responseData.data.token);

        // Opcional: armazenar a validade do token se precisar verificar expiração no frontend
        // Por exemplo, se a API não fornecer, você pode definir uma validade padrão:
        const agora = new Date();
        // Validade de 1 dia (24 horas * 60 minutos * 60 segundos * 1000 milissegundos)
        const validade = agora.getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('adminTokenValidade', validade.toString());

      } else {
        // Caso a API retorne um status 200 (HTTP) mas o corpo da resposta
        // não corresponda ao esperado para um login bem-sucedido.
        console.warn('Resposta de login inesperada ou falha lógica no login:', responseData);
        // Lançar um erro para que o componente possa tratar como falha de login
        throw responseData || { message: 'Formato de resposta de login inválido.' };
      }

      return responseData; // Retorna os dados completos da resposta para o componente
    } catch (error) {
      // O erro já foi logado no console pelo handleResponse do ApiServiceBase.
      // Apenas relançamos para que o componente que chamou possa tratar a UI.
      // Se o erro já é o objeto formatado pelo handleResponse, ele será propagado.
      // Se for um erro lançado pelo 'else' acima, ele também será propagado.
      console.error('Falha detalhada no processo de login (AdministradorLoginService):', error);
      throw error;
    }
  },
};

export default AdministradorLoginService;