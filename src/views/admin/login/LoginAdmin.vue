<template>
  <div class="containerPrincipal">
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

          <div>
            <div class="inputComIcone">
              <span class="mdi mdi-lock-outline iconeSpan"></span>
              <input v-model="form.senha" type="password" placeholder="Senha" class="inputLogin"
                @input="limparErro('senha')" />
            </div>
            <p v-if="erros.senha" class="mensagemErro">{{ erros.senha }}</p>
          </div>
          <p v-if="erroApi.value" class="mensagemErro apiErro">{{ erroApi.value }}</p>
          <button class="botaoEntrar" type="submit" :disabled="carregando.value">
            {{ carregando.value ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
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

const carregando = reactive({ value: false });
const erroApi = reactive({ value: '' });

// Limpa erros nos campos ao digitar
function limparErro(campo) {
  erros[campo] = '';
  erroApi.value = ''; // Limpa erro da API também
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
.containerPrincipal {
  display: flex;
  height: 100vh;
}

.containerImage,
.containerLogin {
  flex: 1 1 50%;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
  /* necessário para posicionamento interno */
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
  z-index: 0;
}

@media (max-width: 768px) {
  .containerPrincipal {
    flex-direction: column;
    /* muda para coluna em telas menores */
  }

  .containerImage,
  .containerLogin {
    margin-top: -50px;
    width: 100%;
    flex: 1 1 100%;
    height: 50vh;
  }
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
  z-index: 1;
  max-width: 200px;
}

/* Removido .conteudoLogin pois .containerLogin já centraliza */

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
  /* Para ficar acima do blur e da imagem de fundo */
}

.tituloLogin {
  font-size: 40px;
  font-weight: 600;
  color: #333;
}

.textoLogin {
  max-width: 260px;
  font-size: 14px;
  color: #9FA5C0;
}

.formularioLogin {
  width: 100%;
  max-width: 390px;
  /* Para manter uma largura máxima consistente */
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 15px;
  /* Aumentado o gap para melhor espaçamento */
  z-index: 2;
  /* Para ficar acima do blur e da imagem de fundo */
}

.inputComIcone {
  position: relative;
  width: 100%;
}

.iconeSpan {
  position: absolute;
  top: 50%;
  left: 15px;
  /* Ajustado para melhor alinhamento */
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
  pointer-events: none;
}

.inputLogin {
  width: 100%;
  /* Ocupa toda a largura do .inputComIcone */
  height: 56px;
  padding: 10px 15px 10px 45px;
  /* Ajustado padding para o ícone */
  border: 1px solid #D0DBEA;
  border-radius: 40px;
  font-size: 16px;
  box-sizing: border-box;
}

.mensagemErro {
  color: #DC363C;
  font-size: 12px;
  margin-left: 7px;
  margin-top: 4px;
  /* Adicionado espaço acima da mensagem de erro */
}

.mensagemErro.apiErro {
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
  /* Espaço abaixo da mensagem de erro da API */
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
  /* Reduzido margin-top */
}

.botaoEntrar:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .formularioLogin {
    flex-direction: column;
  }

  .containerPrincipal {
    flex-direction: column;
    align-items: center;
  }

  .logoInicial {
    margin-top: 70px;
    margin-bottom: 90px;
  }

  .tituloLogin {
    font-size: 32px;
  }

  .cabecalhoLogin {
    display: none;
  }

  .cabecalhoLoginMenor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
  }

  .blurOverlay {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .inputLogin {
    width: 100%;
    /* Garante que o input ocupe a largura disponível */
  }
}
</style>