<template>
  <div class="paginaPedidos">
    <div class="cabecalhoPedidos">
      <BotaoVoltar destino="/admin" textPage="Pedidos de Hoje" />
      <div class="acoesPedidos">
        <button class="botaoTexto" @click="irParaHistorico">
          <span class="mdi mdi-history"></span>
          Ver Histórico Completo
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando pedidos...</p>
    </div>
    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>
    <div v-else-if="Object.keys(pedidosPorEvento).length > 0" class="containerEventos">
      <div
        v-for="(pedidosDoEvento, nomeEvento) in pedidosPorEvento"
        :key="nomeEvento"
        class="grupoEvento"
      >
        <div class="cabecalhoEvento">
          <h3 class="tituloEvento">{{ nomeEvento }}</h3>
        </div>
        <div class="listaPedidos">
          <CardPedido 
            v-for="pedido in pedidosDoEvento"
            :key="pedido.id_pedido"
            :id="pedido.id_pedido"
            :quarto="pedido.quarto"
            :nome="`Quarto ${pedido.quarto}`"
            :horario="pedido.horario_cafe_manha"
            @click="verDetalhesDoPedido(pedido.id_pedido)"
            class="card-clicavel"
          />
        </div>
      </div>
    </div>
    <div v-else class="sem-pedidos">
      <p>Nenhum pedido realizado hoje.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardPedido from '@/components/cards/CardPedido.vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';

const router = useRouter();
const pedidos = ref([]);
const isLoading = ref(true);
const erroApi = ref(null);

const pedidosPorEvento = computed(() => {
  return (pedidos.value || []).reduce((acc, pedido) => {
    const nomeEvento = pedido.evento?.nome_evento || 'Pedidos Gerais';
    if (!acc[nomeEvento]) acc[nomeEvento] = [];
    acc[nomeEvento].push(pedido);
    return acc;
  }, {});
});

onMounted(async () => {
  try {
    isLoading.value = true;
    erroApi.value = null;
    const dados = await PedidoService.listarPedidosDeHoje();
    pedidos.value = dados;
  } catch (error) {
    console.error("Erro ao buscar os pedidos de hoje:", error);
    erroApi.value = "Falha ao carregar os pedidos. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
});

function verDetalhesDoPedido(pedidoId) {
  router.push(`/admin/pedidos/${pedidoId}`);
}

function irParaHistorico() {
  router.push('/admin/historico-pedidos');
}
</script>

<style scoped>
.cabecalhoPedidos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.acoesPedidos {
  display: flex;
  gap: 12px;
}

.botaoTexto {
  background: none;
  border: none;
  color: #ff9800;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.botaoTexto:hover,
.botaoTexto:focus {
  background: #fff3e0;
  outline: none;
}
</style>