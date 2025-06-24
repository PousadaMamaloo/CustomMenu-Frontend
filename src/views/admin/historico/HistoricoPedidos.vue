<template>
  <div class="paginaHistorico">
    <div class="cabecalhoHistorico">
      <BotaoVoltar destino="/admin" textPage="Histórico de Pedidos" />
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando histórico...</p>
    </div>

    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>

    <div v-else-if="pedidosDoHistorico.length > 0" class="containerLista">
      <div class="listaPedidos">
        <CardPedido
          v-for="pedido in pedidosDoHistorico"
          :key="pedido.id_pedido"
          :id="pedido.id_pedido"
          :quarto="pedido.quarto"
          :data="formatarData(pedido.data_pedido)"
          :horario="formatarHora(pedido.data_pedido)"
          :total-itens="pedido.itens.length" 
          :status="pedido.status || 'Entregue'"
          @ver-mais="verDetalhes"
          @reaproveitar="reaproveitarPedido"
        />
      </div>

      <div v-if="totalPaginas > 1" class="paginacao">
        <button
          @click="paginaAnterior"
          :disabled="paginaAtual === 1"
          class="botaoPaginacao"
        >
          Anterior
        </button>
        <span class="infoPagina">
          Página {{ paginaAtual }} de {{ totalPaginas }}
        </span>
        <button
          @click="proximaPagina"
          :disabled="paginaAtual === totalPaginas"
          class="botaoPaginacao"
        >
          Próxima
        </button>
      </div>
    </div>

    <div v-else class="sem-pedidos">
      <p>Nenhum pedido encontrado no histórico.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import CardPedido from '@/components/cards/CardPedido.vue';
import PedidoService from '@/services/PedidoService';

const router = useRouter();

const pedidosDoHistorico = ref([]);
const paginaAtual = ref(1);
const totalPaginas = ref(1);
const itensPorPagina = ref(50);
const isLoading = ref(true);
const erroApi = ref(null);

async function fetchHistorico() {
  try {
    isLoading.value = true;
    erroApi.value = null;

    const response = await PedidoService.listarHistorico(
      paginaAtual.value,
      itensPorPagina.value
    );

    if (response && response.pedidos) {
      pedidosDoHistorico.value = response.pedidos;
      totalPaginas.value = response.paginacao.total_paginas;
    } else {
      pedidosDoHistorico.value = [];
      totalPaginas.value = 1;
    }
  } catch (error) {
    console.error('Erro ao buscar histórico de pedidos:', error);
    erroApi.value =
      'Falha ao carregar o histórico. Tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchHistorico);
watch(paginaAtual, fetchHistorico);

function proximaPagina() {
  if (paginaAtual.value < totalPaginas.value) paginaAtual.value++;
}

function paginaAnterior() {
  if (paginaAtual.value > 1) paginaAtual.value--;
}

function verDetalhes(pedidoId) {
  // Esta função agora é chamada pelo evento do card
  router.push({ name: 'DetalhePedidoHistorico', params: { id: pedidoId } });
}

function formatarData(dataString) {
  if (!dataString) return '--/--/----';
  return new Date(dataString).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}

function formatarHora(dataString) {
  if (!dataString) return '--:--';
  return new Date(dataString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}
</script>

<style scoped>
.paginaHistorico {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cabecalhoHistorico {
  width: 100%;
}

.listaPedidos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-clicavel {
  cursor: pointer;
}

.carregando,
.erro,
.sem-pedidos {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 16px;
}

.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-bottom: 24px;
}

.botaoPaginacao {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.botaoPaginacao:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.infoPagina {
  font-weight: 500;
  color: #555;
}
</style>
