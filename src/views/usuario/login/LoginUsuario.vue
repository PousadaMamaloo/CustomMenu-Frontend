<template>
  <div class="containerPrincipalLogin">

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

.logoInicial {
  position: relative;
  z-index: 2;
  max-width: 200px;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
}

.mensagemErro {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 6px;
  padding-left: 5px;
}

@media (max-width: 768px) {
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

}
</style>