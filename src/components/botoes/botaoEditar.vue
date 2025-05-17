<template>
  <div class="editarQuarto">
    <button  @click="$emit('click')">Editar</button>
  </div>
</template>

<script setup>
defineEmits(['click']);
</script>

<style>
.editarQuarto {
  margin-left: auto;
  align-content: center;
}

.editarQuarto > button {
  color: #78828A;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
}
</style>