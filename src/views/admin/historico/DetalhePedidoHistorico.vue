<template>
  <div class="paginaDetalhes">
    <div class="detalhesCabecalho">
      <BotaoVoltar :textPage="pedido ? `Detalhes do Pedido #${pedido.id_pedido}` : 'Detalhes do Pedido'" />
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando detalhes do pedido...</p>
    </div>

    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>

    <div v-else-if="pedido">
      <section class="detalhesSecao">
        <h3 class="detalhesSubtitulo">Informações gerais</h3>
        <div class="detalhesBox">
          <div v-if="pedido.evento" class="detalhesInfoLinha">
            <span class="detalhesInfoLabel">Evento:</span>
            <span class="detalhesInfoValor">{{ pedido.evento }}</span>
          </div>
          <div class="detalhesInfoLinha">
            <span class="detalhesInfoLabel">Pedido realizado em:</span>
            <span class="detalhesInfoValor">{{ formatarData(pedido.data_pedido) }}</span>
          </div>
        </div>
      </section>

      <section class="detalhesSecao">
        <h3 class="detalhesSubtitulo">Itens do pedido</h3>
        <div class="detalhesBox">
          <div v-for="item in pedido.itens" :key="item.id_item" class="detalhesItemLinha">
            <div class="detalhesItemInfo">
              <div class="detalhesItemNome">{{ item.nome }}</div>
              <div class="detalhesItemQtd">Quantidade: {{ item.quantidade }}</div>
            </div>
            <div class="detalhesItemValorTotal">
              {{ formatarMoeda(item.valor_total) }}
            </div>
          </div>
        </div>
      </section>

      <section class="relatorioSecao" v-if="pedido.obs_pedido">
        <h3 class="relatorioSubtitulo">Observação</h3>
        <div class="relatorioBox">
          <p>{{ pedido.obs_pedido }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';

const route = useRoute();
const pedido = ref(null);
const isLoading = ref(true);
const erroApi = ref(null);

onMounted(async () => {
  const pedidoId = route.params.id;
  if (!pedidoId) {
    erroApi.value = 'ID do pedido não fornecido.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await PedidoService.obterPedidoPorId(pedidoId);
    pedido.value = response;
  } catch (error) {
    erroApi.value = 'Falha ao carregar detalhes do pedido.';
  } finally {
    isLoading.value = false;
  }
});

function formatarData(dataString) {
  if (!dataString) return '-';
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  if (typeof valor !== 'number') return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
</script>

<style scoped>
.paginaDetalhes {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.detalhesCabecalho {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.detalhesSecao {
  margin-bottom: 24px;
}

.detalhesSubtitulo {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 12px;
}

.detalhesBox {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.detalhesInfoBox {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
}

.detalhesInfoLinha {
  display: flex;
  justify-content: space-between;
}

.detalhesInfoLabel {
  color: #555;
}

.detalhesInfoValor {
  font-weight: 600;
  color: #333;
}

.detalhesItensBox {
  display: flex;
  flex-direction: column;
}

.detalhesItemLinha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detalhesItemLinha:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detalhesItemLinha:first-child {
  padding-top: 0;
}

.detalhesItemInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detalhesItemNome {
  font-weight: 600;
  font-size: 16px;
}

.detalhesItemQtd {
  font-size: 14px;
  color: #777;
}

.detalhesItemValorTotal {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
}

.carregando,
.erro {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 16px;
  font-weight: 500;
}
</style>