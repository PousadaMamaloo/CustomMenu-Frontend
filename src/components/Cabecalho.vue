<template>
  <div class="cabecalhoContainer">
    <button class="cabecalhoBotaoLogo" @click="navegarParaInicio">
      <img
        src="../assets/icons/MamalooPortalIcone.png"
        alt="Logo Mamaloo"
        class="cabecalhoLogo"
      />
    </button>
    <button class="botaoLogoff" @click="executarLogout">
      <div class="containerIconeLogoff">
        <img
          src="../assets/images/logout.png"
          alt="Logout"
          class="logoutImg"
        />
      </div>
    </button>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

function navegarParaInicio() {
  if (isAdminRoute.value) {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

async function executarLogout() {
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
