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
              <input v-model="form.telef_hospede" v-mask="'(##) #####-####'" type="text" placeholder="Telefone"
                class="inputLogin" :class="{ erro: erros.telef_hospede }" @input="limparErro('telef_hospede')" />
            </div>
            <p v-if="erros.telef_hospede" class="mensagemErro">{{ erros.telef_hospede }}</p>
          </div>
          <p v-if="erroApi" class="mensagemErro apiErro">{{ erroApi }}</p>
          <button class="botaoEntrar" type="submit" :disabled="carregando">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="linkNavegacao">
            <button type="button" class="linkAdmin" @click="irParaLoginAdmin">
              Acesso de Admin
            </button>
          </div>
        </div>
      </form>

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
        <h1 class="tituloLogin">Bem-vindo</h1>
        <p class="textoLogin">
          Escolha suas opções favoritas e tenha um café da manhã preparado especialmente para você!🍞🍓🍯
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({
  num_quarto: '',
  telef_hospede: ''
});

const erros = reactive({
  num_quarto: '',
  telef_hospede: ''
});

const carregando = ref(false);
const erroApi = ref('');

function limparErro(campo) {
  erros[campo] = '';
  erroApi.value = '';
}

function irParaLoginAdmin() {
  router.push('/admin/login');
}

async function entrar() {
  erros.num_quarto = '';
  erros.telef_hospede = '';
  erroApi.value = '';

  let valido = true;
  if (!form.num_quarto) {
    erros.num_quarto = 'O número do quarto é obrigatório.';
    valido = false;
  }
  if (!form.telef_hospede.trim() || form.telef_hospede.length < 15) {
    erros.telef_hospede = 'O telefone é obrigatório e deve ser válido.';
    valido = false;
  }
  if (!valido) {
    toast.error('Por favor, preencha todos os campos corretamente.');
    return;
  }

  carregando.value = true;
  try {
    const cleanTelefone = form.telef_hospede.replace(/\D/g, '');
    const userData = await authStore.loginGuest({ ...form, telef_hospede: cleanTelefone });

    if (userData) {
      toast.success("Login realizado com sucesso! Bem-vindo(a)!");
      const redirectPath = route.query.redirect || { name: 'HospedeHome' };
      router.push(redirectPath);
    } else {
      // Caso loginGuest não retorne dados, por segurança.
      throw new Error('Não foi possível obter os dados do usuário após o login.');
    }

  } catch (error) {
    const mensagemParaUsuario = error.message || 'Falha no login. Verifique os dados e tente novamente.';
    erroApi.value = mensagemParaUsuario;
    toast.error(mensagemParaUsuario);
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.linkNavegacao {
  margin-top: 20px;
  text-align: center;
}

.linkAdmin {
  background: none;
  border: none;
  color: #f8a953;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 8px;
  transition: color 0.3s ease;
}

.linkAdmin:hover {
  color: #d48946;
}

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

.apiErro {
  text-align: center;
  width: 100%;
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
  .containerPrincipalLogin {
    flex-direction: column;
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
