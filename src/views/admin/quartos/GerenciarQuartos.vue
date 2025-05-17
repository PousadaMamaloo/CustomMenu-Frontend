<template>
  <div class="containerInicial">
    <h1 class="tituloQuartos">Quartos</h1>
    <div class="botoesDeAcao">
      <button class="botaoFiltro">
        <span class="estiloIcone mdi mdi-tune-variant"></span>
      </button>
      <button class="botaoConfiguracao">
        <span class="estiloIcone mdi mdi-cog"></span>
      </button>
    </div>
  </div>
  <div class="containerQuartos">
    <CardQuarto />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import CardQuarto from '../../components/cards/CardQuarto.vue';


</script>

<style>

.containerInicial {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tituloQuartos {
  font-size: 20px;
}

.botoesDeAcao {
  display: flex;
  gap: 15px;
}

.botaoFiltro, .botaoConfiguracao {
  background-color: #F8A953;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  width: 37px;
  height: 37px;
}

.alinhamentoStatus {
  display: flex;
  align-items: center ;
  margin-top: -7px;
}

.estiloIcone {
  font-size: 18px;
  color: #FFFFFF;
}

.containerQuartos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Espaçamento entre os cards */
  max-width: calc(2 * 500px + 8px); /* 2 cards de até 500px + gap entre eles */
  margin: 0 auto; /* Centraliza o container */
  justify-content: flex-start;
}

</style>