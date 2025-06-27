<template>
  <div class="paginaPedidos">
    <div class="cabecalhoPedidos">
      <BotaoVoltar destino="/admin" textPage="Pedidos de Hoje" />
      <div class="acoesPedidos">
        <button class="botaoTexto" @click="irParaHistorico">
          <span class="mdi mdi-history"></span>
          Ver Histórico Completo
        </button>
        <button class="botaoTexto" @click="irParaComanda">
          <span class="mdi mdi-clipboard-list-outline"></span>
          Comanda do Dia
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
      <div v-for="(pedidosDoEvento, nomeEvento) in pedidosPorEvento" :key="nomeEvento" class="grupoEvento">
        <div class="cabecalhoEvento">
          <h3 class="tituloEvento">{{ nomeEvento }}</h3>
        </div>
        <div class="listaPedidos">
          <CardPedido 
            v-for="pedido in pedidosDoEvento"
            :key="pedido.id_pedido"
            :id="pedido.id_pedido"
            :titulo="`Pedido Quarto ${pedido.quarto}`"
            :subtitulo="pedido.hospede?.nome_hospede"
            :horario="pedido.horario_cafe_manha"
            @click="verDetalhesDoPedido"
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
import ApiServiceBase from '@/services/ApiServices';

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

function irParaComanda() {
  router.push('/admin/pedidos/comanda/geral');
}

function formatarData(dataString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dataString).toLocaleDateString('pt-BR', options);
}

async function buscarHospedePorQuarto(numeroQuarto) {
  const hospedes = await ApiServiceBase.get('/hospedes/listar');
  // Supondo que cada hóspede tem um campo num_quarto ou similar
  const hospede = hospedes.data.find(h => h.num_quarto === numeroQuarto);
  return hospede ? hospede.nome_hospede : '';
}
</script>

<style scoped>
/* Seus estilos originais aqui... */
.paginaPedidos { max-width: 1000px; margin: 0 auto; padding: 24px 12px 40px 12px; }
.cabecalhoPedidos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.acoesPedidos { display: flex; gap: 10px; }
.grupoEvento { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px #0001; padding: 24px 18px 18px 18px; margin-bottom: 32px; }
.cabecalhoEvento { margin-bottom: 18px; text-align: center; }
.tituloEvento { font-size: 22px; font-weight: 700; color: #050202; margin: 0; letter-spacing: 0.5px; }
.listaPedidos { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.carregando, .erro, .sem-pedidos { text-align: center; margin-top: 60px; color: #bdbdbd; font-size: 18px; font-weight: 500; }
.botaoTexto { background: none; border: none; color: #ff9800; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 6px; transition: background 0.2s; }
.botaoTexto:hover, .botaoTexto:focus { background: #fff3e0; outline: none; }
</style>