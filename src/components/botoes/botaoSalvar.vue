<template>
  <button type="submit" class="botaoSalvar" @click="$emit('click')">
    <span>Salvar</span>
  </button>
</template>

<script setup>

defineProps({
  carregando: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

</script>

<style scoped>
.botaoSalvar {
  padding: 14px;
  background: linear-gradient(to right, #f8a953, #d48946);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 327px;
}

.botaoSalvar:hover {
  background-color: #e59315;
}

.botaoSalvar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner de carregamento */
.spinnerCarregamento {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>