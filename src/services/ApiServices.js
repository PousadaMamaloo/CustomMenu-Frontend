import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Pode substituir por uma variável de ambiente depois

const ApiServices = {
    async post(endpoint, dados) {
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, JSON.stringify(dados),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (erro) {
            console.error('Erro ao fazer POST:', erro);
            throw erro;
        }
    },
};

export default ApiServices;
