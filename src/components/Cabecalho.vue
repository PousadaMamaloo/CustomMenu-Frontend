<template>
    <div class="cabecalho_container">
      <button class="cabecalho_botao_logo">
        <img src="../assets/icons/MamalooPortalIcone.png" alt="Logo Mamaloo" class="cabecalho_logo" />
      </button>
      <button class="cabecalho_botao_linguas">
        <div class="cabecalho_idiomas">
          <SvgIcon type="mdi" :path="icone" />
        </div>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiEarthPlus } from '@mdi/js'
  
  const icone = ref(mdiEarthPlus)
  </script>
  
  <style scoped>
  .cabecalho_container {
    background-image: linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('../assets/images/FundoCabecalho.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    min-height: 12vh;
    padding: 2vh 2vh;
}
  .cabecalho_logo {
    width: 10vh;
    height: 4vh;
  }

  button {
    all: unset;
    display: flex;
  }

  </style>
  