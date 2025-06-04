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
  color: white;
  height: 37px;
  width: 78px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

@media (min-width: 769px) {
    .botaoAdicionar {
      width: 100px;
      height: 50px;
      font-size: 16px;
    }
  }

</style>