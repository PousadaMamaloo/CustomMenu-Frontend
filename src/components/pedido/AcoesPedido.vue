<template>
  <div class="acoesPedido">
    <button class="botaoEnviar" @click="$emit('enviar')" :disabled="enviando || !podeEnviar">
      <i class="mdi mdi-send"></i>
      <span v-if="enviando">{{ editando ? 'A atualizar...' : 'A enviar...' }}</span>
      <span v-else>{{ editando ? 'Atualizar Pedido' : 'Enviar Pedido' }}</span>
    </button>
    <button v-if="editando" class="botaoExcluir" @click="$emit('excluir')" :disabled="enviando">
      <i class="mdi mdi-delete"></i>
      Excluir Pedido
    </button>
  </div>
</template>

<script setup>
defineProps({
  enviando: Boolean,
  editando: Boolean,
  podeEnviar: Boolean,
});
defineEmits(['enviar', 'excluir']);
</script>

<style scoped>
.acoesPedido {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  position: sticky;
  bottom: 16px;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
}
.botaoEnviar, .botaoExcluir {
  all: unset;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.botaoEnviar {
  background: linear-gradient(135deg, #f8a953, #d48946);
  color: white;
}
.botaoExcluir {
  background: #fee2e2;
  color: #ef4444;
}
.botaoEnviar:disabled, .botaoExcluir:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@media (min-width: 992px) {
  .acoesPedido {
    position: static;
    box-shadow: none;
    border: none;
    padding: 0;
  }
}
</style>
