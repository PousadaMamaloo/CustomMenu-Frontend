<template>
  <div class="paginaRelatorioPedido">
    <div class="relatorioCabecalho">
      <button class="relatorioVoltar" @click="voltar">
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <h2 v-if="pedido" class="relatorioTitulo">Pedido #{{ pedido.id_pedido }}</h2>
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando detalhes do pedido...</p>
    </div>

    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>

    <div v-else-if="pedido">
      <section class="relatorioSecao">
        <h3 class="relatorioSubtitulo">Informações gerais</h3>
        <div class="relatorioBox relatorioInfoBox">
          <div v-if="pedido.evento" class="relatorioInfoLinha">
            <span class="relatorioInfoLabel">Evento:</span>
            <span class="relatorioInfoValor">{{ pedido.evento }}</span>
          </div>
          <div class="relatorioInfoLinha">
            <span class="relatorioInfoLabel">Pedido realizado em:</span>
            <span class="relatorioInfoValor">{{ formatarDataHora(pedido.data_pedido) }}</span>
          </div>
        </div>
      </section>

      <section class="relatorioSecao">
        <h3 class="relatorioSubtitulo">Itens do pedido</h3>
        <div class="relatorioBox relatorioItensBox">
          <div v-for="item in pedido.itens" :key="item.id_item" class="relatorioItemLinha">
            <div class="relatorioItemInfo">
              <div class="relatorioItemNome">{{ item.nome }}</div>
              <div class="relatorioItemQtd">Quantidade: {{ item.quantidade }}</div>
            </div>
            <div class="relatorioItemValorTotal">
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
import { useRouter, useRoute } from 'vue-router';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';

/**
 * View para exibir o relatório detalhado de um único pedido.
 * Mostra informações como o quarto, evento, observações e a lista
 * completa de itens pedidos com seus respectivos valores e quantidades.
 */

const route = useRoute();
const router = useRouter();
const pedido = ref(null);
const isLoading = ref(true);
const erroApi = ref(null);

function formatarDataHora(dateTimeString) {
  if (!dateTimeString) return '-';
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

function formatarMoeda(valor) {
  if (typeof valor !== 'number') return 'R$ -';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

onMounted(async () => {
  const pedidoId = route.params.id;
  if (!pedidoId) {
    erroApi.value = 'ID do pedido não fornecido.';
    isLoading.value = false;
    return;
  }

  try {
    const dadosDoPedido = await PedidoService.obterPedidoPorId(pedidoId);
    pedido.value = dadosDoPedido;
  } catch (error) {
    if (error.status === 404) {
      erroApi.value = 'Pedido não encontrado.';
    } else {
      erroApi.value = error.message || 'Não foi possível carregar os detalhes do pedido.';
    }
  } finally {
    isLoading.value = false;
  }
});

function voltar() {
  router.back();
}
</script>

<style scoped>
/* Estilos adaptados para os dados da API */
.paginaRelatorioPedido {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  color: #333;
}

.relatorioCabecalho {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.relatorioVoltar {
  border: none;
  background: none;
  font-size: 24px;
  color: #555;
  cursor: pointer;
  margin-right: 10px;
}

.relatorioTitulo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.relatorioSecao {
  margin-bottom: 20px;
}

.relatorioSubtitulo {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.relatorioBox {
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}

.relatorioInfoBox {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.relatorioInfoLinha {
  display: flex;
  justify-content: space-between;
}

.relatorioInfoValor {
  font-weight: bold;
}

.relatorioItensBox {
  display: flex;
  flex-direction: column;
}

.relatorioItemLinha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.relatorioItemLinha:last-child {
  border-bottom: none;
}

.relatorioItemInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.relatorioItemNome {
  font-weight: bold;
  font-size: 15px;
}

.relatorioItemQtd {
  font-size: 14px;
  color: #777;
}

.relatorioItemValorTotal {
  font-size: 15px;
  font-weight: bold;
  color: #28a745;
}

.carregando,
.erro {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 16px;
}
</style>
