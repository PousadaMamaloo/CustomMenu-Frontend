<template>
  <div class="containerCarregamento">
    <div class="animacaoCarregamento"></div>
    <p>{{ mensagemCarregamento }}</p>
    <p v-if="mostrarMensagemLenta" class="mensagemLenta">
      Servidor está respondendo lentamente...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mensagemCarregamento = ref('Carregando...')
const mostrarMensagemLenta = ref(false)
let timeoutId = null

onMounted(() => {
  // Após 5 segundos, mostrar mensagem de servidor lento
  timeoutId = setTimeout(() => {
    mostrarMensagemLenta.value = true
    mensagemCarregamento.value = 'Verificando autenticação...'
  }, 5000)
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.containerCarregamento {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 9999;
}

.animacaoCarregamento {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #f8a953;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

p {
  margin-top: 16px;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
}

.mensagemLenta {
  margin-top: 8px;
  color: #f59e0b;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
