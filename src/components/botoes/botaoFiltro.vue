<template>
  <button class="botaoFiltro" @click="$emit('click')">
    <span class="estiloIcone mdi mdi-tune-variant"></span>
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style>
.botaoFiltro {
  background-color: #f8a953;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.botaoFiltro:hover {
  background-color: #ffa948;
}
</style>
