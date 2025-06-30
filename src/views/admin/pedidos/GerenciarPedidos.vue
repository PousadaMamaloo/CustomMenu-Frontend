<template>
  <div class="paginaPedidos">
    <div class="cabecalhoPedidos">
      <BotaoVoltar destino="/admin" textPage="Pedidos de Eventos Ativos" />
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

    <Loading v-if="isLoading" />
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
            :titulo="`Quarto ${pedido.quarto}`"
            :subtitulo="pedido.hospede?.nome_hospede"
            :horario="pedido.horario_cafe_manha"
            @click="verDetalhesDoPedido"
          />
        </div>
      </div>
    </div>
    <div v-else class="sem-pedidos">
      <p>Nenhum pedido encontrado para os eventos ativos de hoje.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardPedido from '@/components/cards/CardPedido.vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';
import Loading from '@/components/Loading.vue';

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
    console.log('RESPOSTA RECEBIDA DA API:', dados);

    pedidos.value = Array.isArray(dados) ? dados : (dados.data || []);
  } catch (error) {
    console.error("Erro ao buscar os pedidos de eventos ativos:", error);
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
</script>

<style scoped>
.paginaPedidos {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 12px 40px 12px;
}

.cabecalhoPedidos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.acoesPedidos {
  display: flex;
  gap: 10px;
}

.botaoTexto {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f8a953;
  border: 1px solid #e4e4e7;  
  padding: 10px 16px;
  border-radius: 8px;         
  font-size: 14px;
  font-weight: 600;
  color: white;             
  cursor: pointer;
  transition: background-color 0.2s;
}


.grupoEvento {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
  padding: 24px 18px 18px 18px;
  margin-bottom: 24px;
}

.cabecalhoEvento {
  margin-bottom: 18px;
  text-align: center;
}

.tituloEvento {
  font-size: 22px;
  font-weight: 700;
  color: #050202;
  margin: 0;
  letter-spacing: 0.5px;
}

.listaPedidos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.carregando,
.erro,
.sem-pedidos {
  text-align: center;
  margin-top: 60px;
  color: #bdbdbd;
  font-size: 18px;
  font-weight: 500;
}
</style>