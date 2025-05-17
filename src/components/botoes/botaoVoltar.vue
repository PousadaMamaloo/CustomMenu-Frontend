<template>
  <button class="botaoVoltar" @click="confirmarSair">
    <span class="iconeVoltar mdi mdi-chevron-left"></span>
    <p>{{ textPage }}</p>
  </button>
</template>

<script setup>
// Confirmar antes de sair da página
defineProps({
  textPage: {
    type: String,
    default: 'Voltar',
  },
});
function confirmarSair() {
   console.log('implementar lógica');
}
</script>

<style>
.botaoVoltar {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.iconeVoltar {
	font-size: 25px;
}

.botaoVoltar > p {
	font-weight: 600;
	font-size: 18px;
  margin-bottom: 4px;
}
</style>