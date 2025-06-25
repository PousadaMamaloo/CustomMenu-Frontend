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
              <input v-model="form.num_quarto" type="text" placeholder="Número do Quarto" class="inputLogin"
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

      <!-- Botão discreto para acesso admin -->
      <div class="acessoDiscreto">
        <button type="button" class="botaoAdmin" @click="irParaLoginAdmin" title="Acesso Administrativo">
          ⚙️
        </button>
      </div>
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
import HospedeService from '@/services/HospedeService'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/composables/useAuth'

const toast = useToast()
const router = useRouter()
const { setGuestAuthenticated } = useAuth()

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

function irParaLoginAdmin() {
  router.push('/admin/login');
}

async function entrar() {
  erros.num_quarto = ''
  erros.telef_hospede = ''
  erroApi.value = ''
  carregando.value = true

  let valido = true

  if (!form.num_quarto) { // Verifica se é um número válido
    erros.num_quarto = 'O número do quarto é obrigatório.'
    toast.error(erros.num_quarto)
    valido = false
  } else if (isNaN(parseInt(form.num_quarto))) {
    erros.num_quarto = 'Por favor, insira um número de quarto válido.'
    toast.error(erros.num_quarto)
    valido = false
  }


  if (!form.telef_hospede.trim()) {
    erros.telef_hospede = 'O telefone é obrigatório.'
    toast.error(erros.telef_hospede)
    valido = false
  }
  // Adicionar validação de formato de telefone se necessário

  if (!valido) {
    carregando.value = false
    return
  }

  try {
    const responseData = await HospedeService.login(form.num_quarto, form.telef_hospede);

    // Definir estado de autenticação como verdadeiro (o cookie será definido pelo backend)
    // Usar os dados conforme a estrutura da API: responseData.data
    setGuestAuthenticated(true, responseData.data);

    toast.success(responseData?.mensagem || "Login realizado com sucesso!");
    router.push('/hospede/home');
  } catch (error) {
    toast.error('Erro ao realizar login. Verifique os dados e tente novamente.');

    let mensagemParaUsuario = 'Falha no login. Tente novamente.';
    if (error && error.message) {
      mensagemParaUsuario = error.message;
    }

    erroApi.value = mensagemParaUsuario;
    toast.error(mensagemParaUsuario);
  } finally {
    carregando.value = false;
  }
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

.acessoDiscreto {
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index: 10;
}

.botaoAdmin {
  background: rgba(248, 169, 83, 0.1);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.2;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(248, 169, 83, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.botaoAdmin:hover {
  opacity: 0.7;
  background: rgba(248, 169, 83, 0.2);
  transform: scale(1.05);
}

.botaoAdmin:active {
  transform: scale(0.98);
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

  .acessoDiscreto {
    bottom: 10px;
    right: 10px;
  }

  .botaoAdmin {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

}
</style>