<template>
  <div class="containerPrincipal">
    <div class="containerImage">
      <img src="../../../assets/images/FundoTelasAcesso.png" alt="Fundo Mamaloo" class="backLogo">
      <div class="blurOverlay"></div>
      <img src="../../../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="logoInicial" />
      <div class="cabecalhoLoginMenor">
        <h1 class="tituloLogin">Bem-vindo</h1>
        <p class="textoLogin">
          Escolha suas opções favoritas e tenha um café da manhã preparado especialmente para você!🍞🍓🍯
        </p>
      </div>
    </div>

    <div class="containerLogin">
      <div class="cabecalhoLogin">
        <h1 class="tituloLogin">Bem-vindo</h1>
        <p class="textoLogin">
          Escolha suas opções favoritas e tenha um café da manhã preparado especialmente para você!🍞🍓🍯
        </p>
      </div>

      <form @submit.prevent="entrar">
        <div class="formularioLogin">
          <div>
            <div class="inputComIcone">
              <span class="mdi mdi-key-outline iconeSpan"></span>
              <input v-model="form.num_quarto" type="number" placeholder="Número do Quarto" class="inputLogin"
                :class="{ erro: erros.num_quarto }" @input="limparErro('num_quarto')" />
            </div>
            <p v-if="erros.num_quarto" class="mensagemErro">{{ erros.num_quarto }}</p>
          </div>

          <div>
            <div class="inputComIcone">
              <span class="mdi mdi-phone-outline iconeSpan"></span> <!-- Ícone de telefone -->
              <input v-model="form.telef_hospede" type="text" placeholder="Telefone" class="inputLogin"
                :class="{ erro: erros.telef_hospede }" @input="limparErro('telef_hospede')" />
            </div>
            <p v-if="erros.telef_hospede" class="mensagemErro">{{ erros.telef_hospede }}</p>
          </div>
          <p v-if="erroApi" class="mensagemErro apiErro">{{ erroApi }}</p>
          <button class="botaoEntrar" type="submit" :disabled="carregando">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  num_quarto: '',
  telef_hospede: ''
})

const erros = reactive({
  num_quarto: '',
  telef_hospede: ''
})

const carregando = ref(false)
const erroApi = ref('')

function limparErro(campo) {
  erros[campo] = ''
  erroApi.value = ''
}

async function entrar() {
  erros.num_quarto = ''
  erros.telef_hospede = ''
  erroApi.value = ''
  carregando.value = true

  let valido = true

  if (!form.num_quarto) { // Verifica se é um número válido
    erros.num_quarto = 'O número do quarto é obrigatório.'
    valido = false
  } else if (isNaN(parseInt(form.num_quarto))) {
    erros.num_quarto = 'Por favor, insira um número de quarto válido.'
    valido = false
  }


  if (!form.telef_hospede.trim()) {
    erros.telef_hospede = 'O telefone é obrigatório.'
    valido = false
  }
  // Adicionar validação de formato de telefone se necessário

  if (!valido) {
    carregando.value = false
    return
  }

  console.log('Dados do formulário:', form)
  carregando.value = false
}
</script>

<style scoped>
.containerPrincipal {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  /* Para evitar barras de rolagem se a imagem for maior */
}

.containerImage {
  flex: 1 1 55%;
  /* Um pouco mais de espaço para a imagem */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f0f0f0;
  /* Cor de fundo caso a imagem não carregue */
}

.backLogo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Garante que a imagem cubra o container */
  z-index: 0;
}

.blurOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0.8px);
  background-color: rgba(255, 255, 255, 0.3);
  /* Levemente mais transparente */
  z-index: 1;
}

.logoInicial {
  position: relative;
  z-index: 2;
  /* Acima do blur */
  max-width: 220px;
  /* Um pouco maior */
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  /* Sombra suave */
}

.containerLogin {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  /* Mais padding */
  box-sizing: border-box;
  background-color: #fff;
  /* Fundo branco para o formulário */
}

.cabecalhoLogin,
.cabecalhoLoginMenor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  /* Aumentar o gap */
  text-align: center;
  margin-bottom: 30px;
  /* Espaço antes do formulário */
}

.cabecalhoLoginMenor {
  display: none;
  /* Será ativado por media query */
}

.tituloLogin {
  font-size: 28px;
  /* Aumentar tamanho */
  font-weight: 700;
  /* Mais peso */
  color: #2c3e50;
  /* Cor mais escura */
}

.textoLogin {
  font-size: 15px;
  /* Levemente maior */
  color: #555;
  max-width: 320px;
  /* Limitar largura */
  line-height: 1.6;
}

.formularioLogin {
  width: 100%;
  max-width: 360px;
  /* Limitar largura do formulário */
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* Mais espaço entre os inputs */
}

.inputComIcone {
  position: relative;
  width: 100%;
}

.iconeSpan {
  position: absolute;
  top: 50%;
  left: 18px;
  /* Mais espaço para o ícone */
  transform: translateY(-50%);
  font-size: 22px;
  /* Ícone maior */
  color: #7f8c8d;
  /* Cor do ícone */
}

.inputLogin {
  width: 100%;
  height: 58px;
  /* Altura maior */
  font-size: 16px;
  padding: 12px 18px 12px 50px;
  /* Ajustar padding para o ícone */
  border-radius: 12px;
  /* Bordas mais arredondadas */
  border: 1px solid #bdc3c7;
  /* Borda sutil */
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.inputLogin:focus {
  border-color: #f8a953;
  box-shadow: 0 0 0 2px rgba(248, 169, 83, 0.2);
  outline: none;
}

.inputLogin.erro {
  border-color: #e74c3c;
  /* Vermelho para erro */
}

.mensagemErro {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 6px;
  padding-left: 5px;
}

.mensagemErro.apiErro {
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
}

.botaoEntrar {
  width: 100%;
  height: 58px;
  background-color: #f8a953;
  color: white;
  font-size: 17px;
  /* Fonte maior */
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  margin-top: 10px;
  /* Espaço acima do botão */
}

.botaoEntrar:hover {
  background-color: #e1903c;
  /* Cor mais escura no hover */
}

.botaoEntrar:active {
  transform: scale(0.98);
}

.botaoEntrar:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}


@media (max-width: 900px) {
  .containerPrincipal {
    flex-direction: column;
  }

  .containerImage {
    flex: 0 0 40vh;
    /* Altura fixa para a imagem em telas menores */
    width: 100%;
  }

  .logoInicial {
    max-width: 180px;
  }

  .containerLogin {
    flex: 1 1 auto;
    padding: 30px 20px;
    /* Ajustar padding */
    width: 100%;
    justify-content: flex-start;
    /* Alinhar ao topo */
    margin-top: -50px;
    /* Sobrepor um pouco a imagem */
    background-color: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 5;
  }

  .cabecalhoLogin {
    display: none;
    /* Esconder o cabeçalho grande */
  }

  .cabecalhoLoginMenor {
    display: flex;
    /* Mostrar o cabeçalho menor (que estava na imagem) */
    position: absolute;
    /* Posicionar sobre a imagem */
    bottom: 20px;
    /* Perto da base da imagem */
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    /* Acima do blur */
    background-color: rgba(0, 0, 0, 0.5);
    /* Fundo semi-transparente */
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
  }

  .cabecalhoLoginMenor .tituloLogin,
  .cabecalhoLoginMenor .textoLogin {
    color: white;
    /* Texto branco para contraste */
  }

  .cabecalhoLoginMenor .tituloLogin {
    font-size: 22px;
  }

  .cabecalhoLoginMenor .textoLogin {
    font-size: 13px;
    max-width: 90%;
  }

  .formularioLogin {
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .tituloLogin {
    font-size: 24px;
  }

  .textoLogin {
    font-size: 14px;
  }

  .inputLogin,
  .botaoEntrar {
    height: 52px;
    font-size: 15px;
  }

  .iconeSpan {
    font-size: 20px;
    left: 15px;
  }

  .inputLogin {
    padding-left: 45px;
  }

  .cabecalhoLoginMenor {
    padding: 8px 15px;
  }

  .cabecalhoLoginMenor .tituloLogin {
    font-size: 18px;
  }

  .cabecalhoLoginMenor .textoLogin {
    font-size: 12px;
  }
}
</style>