<template>
  <button class="botaoVoltar" @click="confirmarSair">
    <span class="iconeVoltar mdi mdi-chevron-left"></span>
    <h1 class="tituloPagina">{{ textPage }}</h1>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  textPage: {
    type: String,
    default: 'Voltar',
  },
  destino: {
    type: String,
    default: '/',
    validator: (value) => ['/', 'produto', 'quarto', 'evento', 'pedido'].includes(value)
  }
})

function confirmarSair() {
  const rotas = {
    '/': '/admin',
    produto: '/admin/produto',
    quarto: '/admin/quarto',
    evento: '/admin/evento',
    pedido: '/admin/pedido'
  }

  const rotaDestino = rotas[props.destino] || '/'
  router.push(rotaDestino)
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

.botaoVoltar>p {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 4px;
}

.tituloPagina {
  font-size: 20px;
  font-weight: 700;
}
</style>
