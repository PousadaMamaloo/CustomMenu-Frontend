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
              <span class="mdi mdi-account-outline iconeSpan"></span>
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
              @click="mostrarSenha = !mostrarSenha" style="cursor: pointer; position: absolute; right: 10px;"></span>
          </div>
          <p v-if="erros.senha" class="mensagemErro">{{ erros.senha }}</p>

          <p v-if="erroApi" class="mensagemErro apiErro">{{ erroApi }}</p>
          <button class="botaoEntrar" type="submit" :disabled="carregando">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
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
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({
  usuario: '',
  senha: ''
});

const erros = reactive({
  usuario: '',
  senha: ''
});

const mostrarSenha = ref(false);
const carregando = ref(false);
const erroApi = ref('');

function limparErro(campo) {
  if (erros[campo]) {
      erros[campo] = '';
  }
  if (erroApi.value) {
      erroApi.value = '';
  }
}

function irParaLoginHospede() {
  router.push('/hospede/login');
}

async function logarAdmin() {
  erros.usuario = '';
  erros.senha = '';
  erroApi.value = '';

  let valido = true;
  if (!form.usuario.trim()) {
    erros.usuario = 'O login é obrigatório';
    valido = false;
  }
  if (!form.senha) {
    erros.senha = 'A senha é obrigatória';
    valido = false;
  }
  if (!valido) return;

  carregando.value = true;
  try {
    await authStore.loginAdmin(form);
    
    toast.success("Login realizado com sucesso!");
    
    const redirectPath = route.query.redirect || { name: 'AdminDashboard' };
    router.push(redirectPath);

  } catch (error) {
    const mensagem = error.message || 'Login ou senha inválidos.';
    erroApi.value = mensagem;
    toast.error(mensagem);
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
  min-height: 18px; /* Evita que o layout "pule" quando a mensagem aparece */
}
.apiErro {
  text-align: center;
  width: 100%;
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

.inputComIcone + .mensagemErro {
    display: block;
    width: 100%;
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
  }
}
</style>