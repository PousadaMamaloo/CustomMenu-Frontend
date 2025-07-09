<template>
  <div class="resumo-pedido">
    <h3 class="resumo-titulo">
      <span class="mdi mdi-receipt-text-outline"></span>
      Resumo do Pedido
    </h3>

    <div class="resumo-conteudo">
      <div v-if="itensComQuantidade.length === 0" class="resumo-vazio">
        <p>Nenhum item selecionado</p>
      </div>

      <div v-else class="resumo-lista">
        <div v-for="item in itensComQuantidade" :key="item.id_item" class="resumo-item">
          <div class="item-info">
            <span class="item-nome">{{ item.nome_item }}</span>
            <div class="item-detalhes">
              <span class="item-quantidade">{{ item.quantidade }}x</span>
              <div v-if="item.quantidadePaga > 0" class="item-valores">
                <span class="valor-gratuito">
                  {{ item.quantidadeGratuita }}x Grátis
                </span>
                <!-- <span class="valor-pago">
                  {{ item.quantidadePaga }}x {{ formatarMoeda(item.valor_item) }}
                </span> -->
              </div>
            </div>
          </div>
          <div class="item-total">
            {{ formatarMoeda(item.valorTotal) }}
          </div>
        </div>
      </div>

      <div v-if="itensComQuantidade.length > 0" class="resumo-total">
        <div class="total-linha">
          <span class="total-label">Itens Gratuitos:</span>
          <span class="total-valor">{{ totalItensGratuitos }}</span>
        </div>
        <div v-if="totalItensPagos > 0" class="total-linha">
          <span class="total-label">Itens Pagos:</span>
          <span class="total-valor">{{ totalItensPagos }}</span>
        </div>
        <div class="total-linha total-final">
          <span class="total-label">Total a Pagar:</span>
          <span class="total-valor">{{ formatarMoeda(valorTotalPago) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

/**
 * Componente que exibe um resumo de um pedido, calculando itens gratuitos,
 * itens pagos e o valor total a pagar com base nas regras de negócio.
 * @props {Array} itens - Lista de itens selecionados com suas quantidades.
 */

const authStore = useAuthStore();

const props = defineProps({
  itens: { type: Array, default: () => [] }
});

/**
 * Processa os itens para calcular as quantidades gratuitas e pagas, e o valor total por item.
 */
const itensComQuantidade = computed(() => {
  return props.itens
    .filter(item => item.quantidade > 0)
    .map(item => {
      const maxGratuitaTotal = item.qntd_max_hospede || 0;
      const quantidadeGratuita = Math.min(item.quantidade, maxGratuitaTotal);
      const quantidadePaga = Math.max(0, item.quantidade - maxGratuitaTotal);
      const valorTotal = quantidadePaga * (item.valor_item || 0);

      return {
        ...item,
        quantidadeGratuita,
        quantidadePaga,
        valorTotal
      };
    });
});

const totalItensGratuitos = computed(() => {
  return itensComQuantidade.value.reduce((total, item) => total + item.quantidadeGratuita, 0);
});

const totalItensPagos = computed(() => {
  return itensComQuantidade.value.reduce((total, item) => total + item.quantidadePaga, 0);
});

const valorTotalPago = computed(() => {
  return itensComQuantidade.value.reduce((total, item) => total + item.valorTotal, 0);
});

function formatarMoeda(valor) {
  if (typeof valor !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}
</script>

<style scoped>
.resumo-pedido {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.resumo-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 16px 0;
}

.resumo-titulo .mdi {
  color: #f8a953;
  font-size: 20px;
}

.resumo-vazio {
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  padding: 20px 0;
}

.resumo-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.resumo-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-nome {
  font-weight: 600;
  color: #2d3748;
  display: block;
  margin-bottom: 4px;
}

.item-detalhes {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
}

.item-quantidade {
  color: #4a5568;
  font-weight: 500;
}

.item-valores {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.valor-gratuito {
  color: #38a169;
  font-weight: 500;
}

.valor-pago {
  color: #e53e3e;
  font-weight: 500;
}

.item-total {
  font-weight: 700;
  color: #1a202c;
  font-size: 16px;
}

.resumo-total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f7fafc;
}

.total-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.total-final {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  font-size: 18px;
  font-weight: 700;
}

.total-label {
  color: #4a5568;
}

.total-valor {
  font-weight: 600;
  color: #1a202c;
}

.total-final .total-valor {
  color: #f8a953;
  font-size: 20px;
}
</style>
