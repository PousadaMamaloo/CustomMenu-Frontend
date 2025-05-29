<template>
  <div class="editarQuarto">
    <button @click="$emit('click')">Editar</button>
  </div>
</template>

<script setup>
defineEmits(['click']);
</script>

<style>
.editarQuarto {
  align-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.editarQuarto>button {
  color: #78828A;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
}
</style>