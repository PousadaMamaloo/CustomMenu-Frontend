<template>
  <div class="containerPrincipalLogin">
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

    <div class="containerLogin">
      <div class="cabecalhoLogin">
        <h1 class="tituloLogin">Painel administrativo</h1>
        <p class="textoLogin">
          Gerencie os pedidos e mantenha tudo funcionando perfeitamente.
        </p>
      </div>

      <form @submit.prevent="logarAdmin">
        <div class="formularioLogin">
          <div>
            <div class="inputComIcone">
              <span class="mdi mdi-account-outline iconeSpan"></span> <!-- Ícone de usuário -->
              <input v-model="form.usuario" type="text" placeholder="Login" class="inputLogin"
                @input="limparErro('usuario')" />
            </div>
            <p v-if="erros.usuario" class="mensagemErro">{{ erros.usuario }}</p>
          </div>

          <div class="inputComIcone">
            <span class="mdi mdi-lock-outline iconeSpan"></span>

            <input :type="mostrarSenha ? 'text' : 'password'" v-model="form.senha" placeholder="Senha"
              class="inputLogin" @input="limparErro('senha')" />
            <span class="mdi iconeVisibilidade" :class="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
              @click="mostrarSenha = !mostrarSenha" style="cursor: pointer; position: absolute; right: 10px"></span>
            <p v-if="erros.senha" class="mensagemErro">{{ erros.senha }}</p>
          </div>
          <p v-if="erroApi.value" class="mensagemErro apiErro">{{ erroApi.value }}</p>
          <button class="botaoEntrar" type="submit" :disabled="carregando.value">
            {{ carregando.value ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="linkNavegacao">
            <button type="button" class="linkHospede" @click="irParaLoginHospede">
              Acesso de Hóspede
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router'; // Import useRouter
import AdministradorLoginService from '@/services/AdministradorLoginService';

const toast = useToast();
const router = useRouter(); // Initialize router

const form = reactive({
  usuario: '',
  senha: ''
});

const erros = reactive({
  usuario: '',
  senha: ''
});

const mostrarSenha = ref(false); // controla o olho

const carregando = reactive({ value: false });
const erroApi = reactive({ value: '' });

// Limpa erros nos campos ao digitar
function limparErro(campo) {
  erros[campo] = '';
  erroApi.value = ''; // Limpa erro da API também
}

function irParaLoginHospede() {
  router.push('/hospede/login');
}

async function logarAdmin() {
  // Limpa mensagens de erro anteriores
  erros.usuario = '';
  erros.senha = '';
  erroApi.value = '';
  carregando.value = true;

  let valido = true;

  if (!form.usuario.trim()) {
    erros.usuario = 'O login é obrigatório';
    valido = false;
  }

  if (!form.senha) {
    erros.senha = 'A senha é obrigatória';
    valido = false;
  }

  if (!valido) {
    carregando.value = false;
    return;
  }

  try {
    const responseData = await AdministradorLoginService.login(form.usuario, form.senha);
    toast.success(responseData?.message || "Login realizado com sucesso!");
    router.push('/admin'); // Navigate on successful login
  } catch (error) {
    // error here is the processedError from the service
    console.error('Falha no login (componente):', error.originalData || error); // Log original error for debugging

    let mensagemParaUsuario = 'Falha no login. Tente novamente.'; // Default message
    if (error && error.message) {
      mensagemParaUsuario = error.message; // Use the message from the service
    }

    erroApi.value = mensagemParaUsuario;
    toast.error(mensagemParaUsuario); // Display only the message
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.logoInicial {
  position: relative;
  z-index: 1;
  max-width: 200px;
}

.mensagemErro {
  color: #DC363C;
  font-size: 12px;
  margin-left: 7px;
  margin-top: 4px;
  /* Adicionado espaço acima da mensagem de erro */
}

.iconeVisibilidade {
  margin: 18px 4px 0px 0px;
  font-size: 20px;
  color: #6f6f6f;
}

.linkNavegacao {
  margin-top: 20px;
  text-align: center;
}

.linkHospede {
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

.linkHospede:hover {
  color: #d48946;
}

@media (max-width: 768px) {

  .containerImage,
  .containerLogin {
    margin-top: -50px;
    width: 100%;
    flex: 1 1 100%;
    height: 50vh;
  }

  .formularioLogin {
    flex-direction: column;
  }

  .inputLogin {
    width: 100%;
    /* Garante que o input ocupe a largura disponível */
  }
}
</style>