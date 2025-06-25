<template>
  <div class="paginaHistorico">
    <div class="cabecalhoHistorico">
      <BotaoVoltar destino="/admin/pedidos" textPage="Histórico de Pedidos" />
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
          :nome="`Pedido de ${formatarData(pedido.data_pedido)}`"
          @click="verDetalhes(pedido.id_pedido)"
          class="card-clicavel"
        />
      </div>
      <div v-if="totalPaginas > 1" class="paginacao">
        <button @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
        <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
        <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
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
  isLoading.value = true;
  erroApi.value = null;
  try {
    const response = await PedidoService.listarHistorico({ page: paginaAtual.value, limit: itensPorPagina.value });
    if (response && response.pedidos) {
      pedidosDoHistorico.value = response.pedidos;
      totalPaginas.value = response.paginacao.total_paginas;
    }
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    erroApi.value = "Falha ao carregar o histórico.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchHistorico);
watch(paginaAtual, fetchHistorico);

function proximaPagina() { if (paginaAtual.value < totalPaginas.value) paginaAtual.value++; }
function paginaAnterior() { if (paginaAtual.value > 1) paginaAtual.value--; }

function verDetalhes(pedidoId) {
  router.push({ name: 'DetalhePedidoHistorico', params: { id: pedidoId } });
}

function formatarData(dataString) {
  if (!dataString) return '--/--/----';
  return new Date(dataString).toLocaleDateString('pt-BR');
}
</script>

<style scoped>
/* Seus estilos aqui */
</style>