<template>
  <div class="containerPrincipal">

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
              <span class="mdi mdi-phone-outline iconeSpan"></span> 
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

    <div class="containerImage">
      <img src="../../../assets/images/FundoTelasAcesso.png" alt="Fundo Mamaloo" class="backLogo">
      <div class="blurOverlay"></div>
      <img src="../../../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="logoInicial" />
      <div class="cabecalhoLoginMenor">
        <h1 class="tituloLogin">Painel administrativo</h1>
        <p class="textoLogin">
          Gerencie os pedidos e mantenha tudo funcionando perfeitamente.
        </p>
      </div>
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
}

.containerImage,
.containerLogin {
  flex: 1 1 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
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
  background-color: rgba(255, 255, 255, 0.5);
  /* opacidade + leve esbranquiçado */
  z-index: 1;
}

.logoInicial {
  position: relative;
  z-index: 2;
  /* Acima do blur */
  max-width: 200px;
  /* Um pouco maior */
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  /* Sombra suave */
}

.cabecalhoLogin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  z-index: 2;
  /* Para ficar acima do blur e da imagem de fundo */
}

.cabecalhoLoginMenor {
  display: none;
  z-index: 2;

}

.tituloLogin {
  font-size: 40px;
  font-weight: 600;
  color: #333;
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
  max-width: 390px;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 15px;
  z-index: 2;
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
  height: 56px;
  padding: 10px 15px 10px 45px;
  border: 1px solid #D0DBEA;
  border-radius: 40px;
  font-size: 16px;
  box-sizing: border-box;
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
  height: 56px;
  background-color: #f8a953;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .containerPrincipal {
    flex-direction: column;
  }
  .logoInicial {
    margin-top: 70px;
    margin-bottom: 90px;
  }
  .containerLogin {
    margin-top: -50px;
    width: 100%;
    flex: 1 1 100%;
    height: 50vh;
    order: 2;
  }
  .containerImage {
    width: 100%;
    flex: 1 1 100%;
    height: 50vh;
    order: 1;
  }
  .cabecalhoLogin {
    display: none;
  }
  .blurOverlay {
    background-color: rgba(255, 255, 255, 0.8);
  }
  .cabecalhoLoginMenor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
  }
  .tituloLogin {
    font-size: 32px;
  }
}
</style>