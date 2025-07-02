<template>
  <div v-if="itens.length > 0" class="listaItens">
    <div v-for="item in itens" :key="item.id_item" class="itemPedido">
      <img :src="item.foto_item || '/quarto_placeholder.png'" :alt="item.nome_item" class="itemImg" />
      <div class="itemInfo">
        <span class="itemNome">{{ item.nome_item }}</span>
        <span class="itemDesc">{{ item.desc_item }}</span>
        <div class="itemDetalhes">
          <span v-if="item.qtd_max_item_hospede" class="itemLimite">Máx: {{ item.qtd_max_item_hospede }} por
            pessoa</span>
          <span v-if="item.valor_item > 0" class="itemPreco">
            R$ {{ formatarPreco(item.valor_item) }} (adicional)
          </span>
        </div>
      </div>
      <div class="itemAcoes">
        <div class="contador">
          <button @click="diminuir(item)" :disabled="item.quantidade === 0">
            <i class="mdi mdi-minus"></i>
          </button>
          <span class="quantidade">{{ item.quantidade }}</span>
          <button @click="aumentar(item)">
            <i class="mdi mdi-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="sem-itens">
    <p>Nenhum item disponível para este evento.</p>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';
const toast = useToast();

const props = defineProps({
  itens: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:quantidade']);

function formatarPreco(preco) {
  return Number(preco || 0).toFixed(2).replace('.', ',');
}

function aumentar(item) {
  emit('update:quantidade', { itemId: item.id_item, novaQuantidade: item.quantidade + 1 });
}

function diminuir(item) {
  if (item.quantidade > 0) {
    emit('update:quantidade', { itemId: item.id_item, novaQuantidade: item.quantidade - 1 });
  }
}
</script>

<style scoped>
.listaItens {
  display: grid;
  gap: 16px;
}

.itemPedido {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.itemImg {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.itemInfo {
  flex: 1;
}

.itemNome {
  font-size: 16px;
  font-weight: 600;
}

.itemDesc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.itemDetalhes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.itemPreco {
  font-weight: 600;
  color: #f8a953;
}

.itemLimite {
  font-size: 12px;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  color: #4b5563;
}

.contador {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contador button {
  all: unset;
  width: 32px;
  height: 32px;
  background: #f8a953;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.contador button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantidade {
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.sem-itens {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

@media (min-width: 1024px) {
  .listaItens {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
