<template>
  <button class="botaoAdicionar" @click="$emit('click')">
    Adicionar
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style>
.botaoAdicionar {
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

.botaoAdicionar:hover {
  background-color: #ffa948;
}
</style>
