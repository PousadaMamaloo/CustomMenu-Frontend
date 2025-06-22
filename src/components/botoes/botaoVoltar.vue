<template>
  <button class="botaoVoltar" @click="navegar">
    <span class="iconeVoltar mdi mdi-chevron-left"></span>
    <h1 class="tituloPagina">{{ textPage }}</h1>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  textPage: {
    type: String,
    default: 'Voltar',
  },
  // O destino agora é opcional
  destino: {
    type: String,
    default: null
  }
})

const router = useRouter()

function navegar() {
  // Se uma prop 'destino' foi passada, navega para ela
  if (props.destino) {
    router.push(props.destino)
  } else {
    // Se não, simplesmente volta para a página anterior no histórico
    router.back()
  }
}
</script>

<style>
.botaoVoltar {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.iconeVoltar {
  font-size: 25px;
}

.tituloPagina {
  font-size: 20px;
  font-weight: 700;
}
</style>