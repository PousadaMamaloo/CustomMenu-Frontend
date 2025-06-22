<template>
  <div class="paginaHistorico">
    <div class="cabecalhoHistorico">
      <BotaoVoltar destino="/admin" textPage="Histórico de Pedidos" />
    </div>

    <div class="containerLista">
      <div v-if="pedidosPaginados.length > 0" class="listaPedidos">
        <CardPedido
      v-for="pedido in pedidosPaginados"
      :key="pedido.id"
      :id="pedido.id"
      :quarto="pedido.quarto"
      :nome="`Pedido de ${formatarData(pedido.horarioPedido)}`" 
      :horario="formatarHora(pedido.horarioPedido)"
      status="Entregue" 
      @verDetalhes="verDetalhes"
    />
      </div>
      <div v-else class="sem-pedidos">
        <p>Nenhum pedido encontrado no histórico.</p>
      </div>
    </div>

    <div v-if="totalPaginas > 1" class="paginacao">
      <button @click="paginaAnterior" :disabled="paginaAtual === 1" class="botaoPaginacao">
        Anterior
      </button>
      <span class="infoPagina">Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas" class="botaoPaginacao">
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import CardPedido from '@/components/cards/CardPedido.vue'

const router = useRouter()

const pedidosDoHistorico = ref([]);
const paginaAtual = ref(1);
const totalPaginas = ref(1);
const itensPorPagina = ref(50);
const isLoading = ref(true);

async function fetchHistorico() {
  try {
    isLoading.value = true;
    const response = await PedidoService.listarHistorico(paginaAtual.value, itensPorPagina.value);
    // A resposta contém os dados e a paginação
    pedidosDoHistorico.value = response.data.pedidos;
    totalPaginas.value = response.data.paginacao.total_paginas;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
  } finally {
    isLoading.value = false;
  }
}

// Busca na primeira carga
onMounted(fetchHistorico);
// Busca novamente se o usuário mudar de página
watch(paginaAtual, fetchHistorico);
const paginaAtual = ref(1);
const itensPorPagina = ref(5);

const totalPaginas = computed(() => {
  return Math.ceil(todosOsPedidos.value.length / itensPorPagina.value);
});

const pedidosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value;
  const fim = inicio + itensPorPagina.value;
  return todosOsPedidos.value.slice(inicio, fim);
});

function proximaPagina() {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++;
  }
}

function paginaAnterior() {
  if (paginaAtual.value > 1) {
    paginaAtual.value--;
  }
}

function verDetalhes(pedidoId) {
  router.push(`/admin/pedidos/${pedidoId}`);
}

function formatarData(dataString) {
  const date = new Date(dataString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function formatarHora(dataString) {
  const date = new Date(dataString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-clicavel:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

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
  margin-top: 16px;
  padding-bottom: 24px;
}

.botaoPaginacao {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.botaoPaginacao:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.botaoPaginacao:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.infoPagina {
  font-weight: 500;
  color: #555;
}
</style>