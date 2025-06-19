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
  destino: {
    type: String,
    required: true
  }
})

const router = useRouter()

function navegar() {
  router.push(props.destino)
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