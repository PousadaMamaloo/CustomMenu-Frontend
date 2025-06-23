<template>
  <div class="divPrincipalNotFound">
    <div class="conteudoNotFound">
      <h1 class="tituloNotFound">404</h1>
      <p class="subtituloNotFound">{{ message }}</p>
      <button @click="navigateToRoute" class="botaoRedirecionamentoNotFound">
        <p>{{ buttonText }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  route: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: 'Página não encontrada',
  },
  buttonText: {
    type: String,
    default: 'Voltar para o início',
  },
})

const router = useRouter()

const navigateToRoute = () => {
  router.push(props.route)
}
</script>

<style scoped>
.divPrincipalNotFound {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.tituloNotFound {
  font-size: 50px;
}

.subtituloNotFound {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 5px 0px 20px 0px;
}

.botaoRedirecionamentoNotFound {
  border-radius: 8px;
  height: 50px;
  background-color: #f8a953;
  border: none;
  cursor: pointer;
}

.botaoRedirecionamentoNotFound p {
  padding: 0px 10px 0px 10px;
  font-weight: 600;
  color: #ffffff;
}
</style>
