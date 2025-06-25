<template>
  <div class="cabecalhoContainer">
    <button class="cabecalhoBotaoLogo" @click="navegarParaInicio">
      <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="cabecalhoLogo" />
    </button>
    <button class="botaoLogoff" @click="mostrarModal = true">
      <div class="containerIconeLogoff">
        <img src="../assets/images/logout.png" alt="Logout" class="logoutImg" />
      </div>
    </button>
  </div>

  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal-conteudo">
      <p><b>Deseja realmente fazer o logout?</b></p>
      <div class="modal-botoes">
        <button @click="mostrarModal = false" class="modal-botao-nao">Não</button>
        <button @click="executarLogout" class="modal-botao-sim">Sim</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const mostrarModal = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

function navegarParaInicio() {
  if (isAdminRoute.value) {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

async function executarLogout() {
  mostrarModal.value = false
  try {
    await axios.post('/api/auth/logout')
    if (isAdminRoute.value) {
      window.location.href = '/admin/login'
    } else {
      window.location.href = '/usuario/login'
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    alert('Não foi possível fazer o logout. Tente novamente.')
  }
}
</script>

<style scoped>
.cabecalhoContainer {
  width: 100%;
  background-image: linear-gradient(#ffffff99, #ffffffe1), url('../assets/images/FundoCabecalho.png');
  background-size: auto;
  background-repeat: repeat-x;
  background-position: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
}

.cabecalhoLogo {
  width: 80px;
  height: 30px;
}

.containerIconeLogoff {
  font-size: 27px;
}

.cabecalhoBotaoLogo,
.botaoLogoff {
  all: unset;
  display: flex;
  cursor: pointer;
}

.logoutImg {
  width: 30px;
  height: 30px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-conteudo {
  background-color: #ffffff;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  
}

.modal-conteudo p {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.modal-botoes {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal-botao-sim {
  all: unset;
  padding: 10px 25px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  color: #DD7373;
}

.modal-botao-nao {
  all: unset;
  padding: 10px 25px;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-botoes button:hover {
  opacity: 0.8;
}

@media (min-width: 769px) {
  .cabecalhoContainer {
    padding: 20px 20px;
  }

  .cabecalhoBotaoLogo {
    margin-left: 80px;
  }

  .botaoLogoff {
    margin-right: 80px;
  }

  .cabecalhoLogo {
    width: 150px;
    height: 60px;
  }

  .containerIconeLogoff {
    font-size: 35px;
  }
}

</style>
