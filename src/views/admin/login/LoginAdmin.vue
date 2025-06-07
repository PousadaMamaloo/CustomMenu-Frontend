<template>
    <div class="containerPrincipal">
        <div class="backLogo">
          <div>
              <img src="../../../assets/images/FundoCabecalho.png" alt="Fundo Mamaloo" class="backLogo"> <!--BACKGROUND IMG-->
              <img src="../../../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="logoInicial" /> <!--POSICIONAR EM CIMA do Background - POSITION-->
          </div>
        </div>
        
        <div class="containerLogin">
            <div class="conteudoLogin">
                <div class="cabecalhoLogin">
                  <h1 class="tituloLogin">Painel administrativo</h1> <!--@media max 768px MARGIN TOP = negativo, flex diretion = coloum -->
                  <p class="textoLogin">
                      Gerencie os pedidos e mantenha tudo funcionando perfeitamente.
                  </p>
                </div>
                <form @submit.prevent="logarCardapio">
                  <div class="formularioLogin">
                      <div class="inputComIcone">
                        <span class="mdi mdi-key-outline iconeSpan"></span>
                        <input
                          v-model="form.acesso"
                          type="text"
                          placeholder="Acesso"
                          class="inputLogin"
                          @input="limparErro('acesso')"                        />
                        <p v-if="erros.acesso" class="mensagemErro">{{ erros.acesso }}</p>
                      </div>

                      <div class="inputComIcone">
                          <span class="mdi mdi-lock-outline iconeSpan"></span>
                          <input
                            v-model="form.senha"
                            type="password"
                            placeholder="Token"
                            class="inputLogin"
                            @input="limparErro('senha')"
                          />
                          <p v-if="erros.senha" class="mensagemErro">{{ erros.senha }}</p>
                      </div>

                      <button class="botaoEntrar" type="button" @click="logarCardapio">
                        Entrar
                      </button>
                  </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.backLogo {
  position: relative;
  width: 1400px;
  height: 750px;
  opacity: 0.5;
}

.backLogo img:first-child {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  z-index: 0;
}

.logoInicial {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 211px;
  height: 82px;
  z-index: 1;
}


.containerLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  width: 100%;
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
  gap: 8px;
  text-align: center;
}

.tituloLogin {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.textoLogin {
  font-size: 14px;
  color: #9FA5C0;
}

.formularioLogin {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  width: 100%;
  padding: 10px 10px 10px 38px; /* espaçamento à esquerda para o ícone */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.inputLogin.erro {
  border-color: red;
}

.mensagemErro {
  color: red;
  font-size: 12px;
  margin-top: 4px;
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
  transition: background-color 0.3s;
}

.botaoEntrar:hover {
  background-color: #ffaa33;
}

@media (max-width: 768px) {
  .formularioLogin{
    margin-top: -30px;
    flex-direction: column;
  }
  .cabecalhoLogin{
    margin-top: -100px;
    z-index: 2;
  }
  .containerPrincipal{
    flex-direction: column;
    align-items: center;
  }
  .backLogo {
  position: relative;
  align-items: center;
  width: 100%;
  height: 600px;
  opacity: 0.5;
}
}

</style>