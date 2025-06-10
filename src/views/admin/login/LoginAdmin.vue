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

          <form @submit.prevent="logarCardapio">
            <div class="formularioLogin">
                <div>
                  <div class="inputComIcone">
                    <span class="mdi mdi-key-outline iconeSpan"></span>
                    <input
                      v-model="form.acesso"
                      type="text"
                      placeholder="Acesso"
                      class="inputLogin"
                      @input="limparErro('acesso')"
                    />
                  </div>
                  <p v-if="erros.acesso" class="mensagemErro">{{ erros.acesso }}</p>
                </div>
                
                <div>
                  <div class="inputComIcone">
                    <span class="mdi mdi-lock-outline iconeSpan"></span>
                    <input
                      v-model="form.senha"
                      type="password"
                      placeholder="Token"
                      class="inputLogin"
                      @input="limparErro('senha')"
                    />
                  </div>
                  <p v-if="erros.senha" class="mensagemErro">{{ erros.senha }}</p>
                </div>
                <button class="botaoEntrar" type="button" @click="logarCardapio">
                  Entrar
                </button>
            </div>
          </form>
        </div>
    </div>
</template>

<script setup>

import { reactive } from 'vue';

const form = reactive({
  senha: '',
  acesso: ''
});

const erros = reactive({
  senha: '',
  acesso: ''
});


// Limpa erros nos campos ao digitar
function limparErro(campo) {
  erros[campo] = '';
}

function logarCardapio() {
  // Limpa mensagens de erro anteriores
  erros.acesso = '';
  erros.senha = '';

  let valido = true;

  if (!form.acesso.trim()) {
    erros.acesso = 'O acesso é inválido';
    valido = false;
  }

  if (!form.senha) {
    erros.senha = 'Selecione uma senha válida';
    valido = false;
  }

  if (!valido) return;

  console.log('Formulário válido. Dados:', form);
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
  position: relative; /* necessário para posicionamento interno */
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
    flex-direction: column; /* muda para coluna em telas menores */
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
  background-color: rgba(255, 255, 255, 0.5); /* opacidade + leve esbranquiçado */
  z-index: 1;
}

.logoInicial {
  position: relative;
  z-index: 1;
  max-width: 200px;
}

.conteudoLogin {
  width: 100%;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.cabecalhoLogin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.cabecalhoLoginMenor {
  display: none;
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
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 10px;
}

.inputComIcone {
  position: relative;
  width: 100%;
}

.iconeSpan {
  position: absolute;
  top: 50%;
  left: 12px;  
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
  pointer-events: none;
}

.inputLogin {
  width: 327px;
  height: 56px;
  padding: 10px 10px 10px 38px; 
  border: 1px solid #D0DBEA;
  border-radius: 40px;
  font-size: 16px;
  box-sizing: border-box;
}

.mensagemErro {
  color: #DC363C;
  font-size: 12px;
  margin-left: 7px;
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
  margin-top: 30px;
}

@media (max-width: 768px) {
  .formularioLogin{
    flex-direction: column;
  }
  .containerPrincipal{
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
    z-index: 1;
  }
  .blurOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0.5px);
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1;
  }
}

</style>