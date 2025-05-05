<template>
  <div class="cabecalhoContainer">
    <button class="cabecalhoBotaoLogo">
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
</script>

<style scoped>
.cabecalhoContainer {
  background-image: linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('../assets/images/FundoCabecalho.png');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: space-between;
  min-height: 12vh; /* hexadecimal, para todos*/
  padding: 2vh 2vh;
}
.cabecalhoLogo {
  width: 10vh;
  height: 4vh;
}

.cabecalhoBotaoLogo, .cabecalhoBotaoLinguas {
  all: unset;
  display: flex;
}
</style>
  