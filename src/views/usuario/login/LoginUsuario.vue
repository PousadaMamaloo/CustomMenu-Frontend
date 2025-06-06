<template>
    <div class="containerPrincipal">
        <div class="backLogo">
            <div>
                <img src="../../../assets/images/FundoCabecalho.png" alt="Fundo Mamaloo" class="backLogo"> <!--BACKGROUND IMG-->
                <img src="../../../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="logoInicial" /> <!--POSICIONAR EM CIMA do Background - POSITION-->
            </div>
            <div>
              
            </div>
        </div>
        
        <div class="containerLogin">
            <div class="conteudoLogin">
                <div class="cabecalhoLogin">
                    <h1 class="tituloLogin">Bem-vindo</h1> <!--@media max 768px MARGIN TOP = negativo, flex diretion = coloum -->
                    <p class="textoLogin">
                        Escolha suas opções favoritas e tenha um café da manhã preparado especialmente para você!🍞🍓🍯
                    </p>
                </div>

                <div class="formularioLogin">
    <div class="inputComIcone">
      <span class="mdi mdi-key-outline iconeSpan"></span>
      <input
        v-model="acesso"
        type="text"
        placeholder="Acesso"
        class="inputLogin"
        :class="{ erro: erroAcesso }"
      />
      <p v-if="erroAcesso" class="mensagemErro">Campo de acesso obrigatório</p>
    </div>

    <div class="inputComIcone">
      <span class="mdi mdi-lock-outline iconeSpan"></span>
      <input
        v-model="senha"
        type="password"
        placeholder="Token"
        class="inputLogin"
        :class="{ erro: erroSenha }"
      />
      <p v-if="erroSenha" class="mensagemErro">Campo de token obrigatório</p>
    </div>

    <button class="botaoEntrar" @click="entrar">
      Entrar
    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ApiServices from '../../../services/ApiServices'
import { useRouter } from 'vue-router'
const router = useRouter()

const acesso = ref('')
const senha = ref('')

// Controle de erros nos campos
const erroAcesso = ref(false)
const erroSenha = ref(false)

async function entrar() {
  // Validação simples: campos obrigatórios
  erroAcesso.value = !acesso.value.trim()
  erroSenha.value = !senha.value.trim()

  if (erroAcesso.value || erroSenha.value) return

  try {
    const dados = {
      num_quarto: parseInt(acesso.value),
      telef_hospede: senha.value
    }

    const resposta = await ApiServices.post('/api/hospedes/login', dados)
    console.log('Login bem-sucedido:', resposta)

    router.push('/usuario/pedido')
  
  } catch (erro) {
    console.error('Erro no login:', erro)
    // Aqui você pode exibir um modal, toast, etc.
  }
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
  color: #666;
}

.formularioLogin {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inputComIcone {
  position: relative;
  display: flex;
  align-items: center;
}

.iconeSpan {
  position: absolute;
  left: 12px;
  font-size: 20px;
  color: #888;
}

.inputLogin {
  width: 100%;
  height: 56px;
  font-size: 16px;
  padding: 12px 12px 12px 40px;
  border-radius: 32px;
  border: 1px solid #ccc;
  box-sizing: border-box;
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
.mensagemErro {
  color: red;
  font-size: 0.8rem;
  margin-top: 4px;
}

.erro {
  border: 1px solid red;
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
