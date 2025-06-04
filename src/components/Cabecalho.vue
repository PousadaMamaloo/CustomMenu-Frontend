<template>
  <div class="cabecalhoContainer">
    <button class="cabecalhoBotaoLogo" @click="voltarParaPainel">
      <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="cabecalhoLogo" />
    </button>
    <button class="cabecalhoBotaoLinguas">
      <div class="cabecalhoIdiomas">
        <span class="mdi mdi-earth-plus"></span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function voltarParaPainel() {
  router.push('/admin')
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

.cabecalhoIdiomas {
  font-size: 27px;
}

.cabecalhoBotaoLogo,
.cabecalhoBotaoLinguas {
  all: unset;
  display: flex;
}

@media (min-width: 769px) {
  .cabecalhoContainer {
    padding: 20px 20px;
  }

  .cabecalhoBotaoLogo {
    margin-left: 80px;
  }

  .cabecalhoBotaoLinguas {
    margin-right: 80px;
  }

  .cabecalhoLogo {
    width: 150px;
    height: 60px;
  }

  .cabecalhoIdiomas {
    font-size: 35px;
  }
}
</style>
