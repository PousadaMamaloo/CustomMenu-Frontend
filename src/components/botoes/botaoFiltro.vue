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
  background-color: #F8A953;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  width: 37px;
  height: 37px;
}
</style>