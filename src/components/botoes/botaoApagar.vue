<template>
  <button type="button" class="botaoApagar" @click="confirmarExclusao">
    Apagar produto
  </button>
</template>

<script setup>
function confirmarExclusao() {
 console.log('Implementar lógica de exclusão');
}
</script>

<style>
.botaoApagar {
  padding: 10px;
  background-color: transparent;
  color: #f86f3e;
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
</style>