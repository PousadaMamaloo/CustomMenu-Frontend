<template>
  <div class="paginaPedidos">
    <div class="cabecalhoPedidos">
      <BotaoVoltar destino="/admin" textPage="Pedidos de Hoje" />
      <div class="acoesPedidos">
        <button class="botaoTexto" @click="irParaHistorico">
          <span class="mdi mdi-history"></span>
          Ver Histórico Completo
        </button>
        <button class="botaoTexto" @click="irParaComandaDoDia">
          <span class="mdi mdi-clipboard-list"></span>
          Comanda por Evento
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
        :hospede-nome="`Hóspede do Quarto ${pedido.quarto}`"
        :total-itens="pedido.itens?.length || 0"
        :horario="pedido.horario_cafe_manha"
        @ver-mais="verDetalhesDoPedido(pedido.id_pedido)"
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

function irParaComandaDoDia() {
  router.push({ name: 'ComandaDoDia' });
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
    gap: 10px;
}
.botaoIcone {
    background-color: #f8a953;
    border: none;
    padding: 12px;
    border-radius: 8px;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 37px;
    height: 37px;
}
.botaoIcone:hover {
    background: #ffa948;
}
.opcoes-filtro-checkbox {
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


.botaoTexto:hover,
.botaoTexto:focus {
  background: #fff3e0;
  outline: none;
}

.tituloEvento {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 22px;
  color: #1a202c;
  text-align: center; /* Centraliza o nome do evento */
}

.listaPedidos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 40px;              /* Espaçamento maior entre os cards */
  padding: 24px 0 24px 0; /* Padding maior acima e abaixo */
  max-width: 1000px;      /* Um pouco mais largo para 3 cards folgados */
  margin: 0 auto;

}
</style>