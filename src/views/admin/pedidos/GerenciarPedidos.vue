<template>
    <div class="paginaPedidos">
        <div class="cabecalhoPedidos">
            <BotaoVoltar destino="/admin" textPage="Gerenciar Pedidos" />
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
            <div v-for="(pedidosDoEvento, nomeEvento) in pedidosPorEvento" :key="nomeEvento" class="grupoEvento">
                <div class="cabecalhoEvento">
                    <h3 class="tituloEvento">{{ nomeEvento }}</h3>
                    <button class="botaoComanda" @click="verComandaDoEvento(pedidosDoEvento)" title="Ver comanda deste evento">
                        <span class="mdi mdi-receipt-text-outline"></span>
                        Comanda
                    </button>
                </div>
                <div class="listaPedidos">
                    <CardPedido 
                        v-for="pedido in pedidosDoEvento"
                        :key="pedido.id_pedido"
                        :id="pedido.id_pedido"
                        :quarto="pedido.quarto"
                        :nome="pedido.hospede ? pedido.hospede.nome_hospede : 'Hóspede não identificado'"
                        :horario="formatarHora(pedido.data_pedido)"
                        @click="verDetalhesDoPedido(pedido.id_pedido)"
                        class="card-clicavel"
                    />
                </div>
            </div>
        </div>

        <div v-else class="sem-pedidos">
            <p>Nenhum pedido ativo encontrado.</p>
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
  return pedidos.value.reduce((acc, pedido) => {
    const nomeEvento = pedido.evento?.nome_evento || 'Pedidos sem Evento';
    if (!acc[nomeEvento]) {
      acc[nomeEvento] = [];
    }
    if (pedido.evento) {
      pedido.id_evento = pedido.evento.id_evento;
    }
    acc[nomeEvento].push(pedido);
    return acc;
  }, {});
});

onMounted(async () => {
  try {
    isLoading.value = true;
    erroApi.value = null;
    const dados = await PedidoService.listarPedidosDeEventosAtivos();
    pedidos.value = dados;
  } catch (error) {
    console.error("Erro ao buscar pedidos ativos:", error);
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

function verComandaDoEvento(pedidosDoEvento) {
  const idEvento = pedidosDoEvento[0]?.id_evento;
  if (idEvento) {
    // A rota para o relatório de evento espera um 'id' como parâmetro
    router.push({ name: 'RelatorioGeralPedidos', params: { id: idEvento } }); 
  } else {
    alert("Este grupo não pertence a um evento específico para gerar comanda.");
  }
}

function formatarHora(dataString) {
    if (!dataString) return '--:--';
    const date = new Date(dataString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
}
</script>

<style scoped>
/* Seus estilos originais aqui... */
.paginaPedidos { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
.cabecalhoPedidos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.acoesPedidos { display: flex; gap: 10px; }
.botaoTexto { display: inline-flex; align-items: center; gap: 8px; background-color: #f1f1f1; border: 1px solid #ddd; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #333; cursor: pointer; }
.containerEventos { display: flex; flex-direction: column; gap: 32px; }
.cabecalhoEvento { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 12px; }
.tituloEvento { font-size: 22px; font-weight: 700; color: #333; }
.botaoComanda { display: inline-flex; align-items: center; gap: 8px; background: none; border: 1px solid #f8a953; color: #f8a953; padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.listaPedidos { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
.card-clicavel { cursor: pointer; }
.carregando, .erro, .sem-pedidos { text-align: center; padding: 40px; font-size: 16px; color: #777; }
</style>