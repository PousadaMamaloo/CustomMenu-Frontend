<template>
  <div class="resumoPedido">
    <h3>Resumo do Pedido</h3>
    <div class="estatisticas">
      <div class="estatCard">
        <div class="estatNumero">{{ totalItens }}</div>
        <div class="estatLabel">Itens Selecionados</div>
      </div>
      <div class="estatCard">
        <div class="estatNumero">{{ valorTotal }}</div>
        <div class="estatLabel">Valor Total</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  itens: {
    type: Array,
    default: () => [],
  },
});

const totalItens = computed(() => props.itens.reduce((total, item) => total + item.quantidade, 0));

const valorTotal = computed(() => {
  const total = props.itens.reduce((total, item) => total + (item.quantidade * (item.valor_item || 0)), 0);
  return `R$ ${total.toFixed(2).replace('.', ',')}`;
});
</script>

<style scoped>
.resumoPedido {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}
.resumoPedido h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}
.estatisticas {
  display: flex;
  gap: 16px;
}
.estatCard {
  flex: 1;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}
.estatNumero {
  font-size: 24px;
  font-weight: 700;
  color: #f8a953;
}
.estatLabel {
  font-size: 12px;
  color: #6b7280;
}
</style>
