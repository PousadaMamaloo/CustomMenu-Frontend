<template>
  <div class="paginaHistorico">
    <h1 class="tituloHistorico">Histórico de Pedidos</h1>
    <div v-if="isLoading" class="carregando">
      <p>Carregando histórico...</p>
    </div>
    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>
    <div v-else-if="pedidosHistorico.length > 0" class="listaPedidos">
      <CardPedido
        v-for="pedido in pedidosHistorico"
        :key="pedido.id_pedido"
        :id="pedido.id_pedido"
        :quarto="pedido.quarto"
        :total-itens="pedido.itens?.length || 0"
        :horario="pedido.horario_cafe_manha"
        @ver-mais="verDetalhesDoPedido(pedido.id_pedido)"
      />
    </div>
    <div v-else class="sem-pedidos">
      <p>Nenhum pedido encontrado no histórico.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardPedido from '@/components/cards/CardPedido.vue';
import PedidoService from '@/services/PedidoService';

const router = useRouter();
const pedidosHistorico = ref([]);
const isLoading = ref(true);
const erroApi = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    erroApi.value = null;
    // Ajuste o método conforme seu backend para histórico do hóspede
    const response = await PedidoService.listarHistorico();
    pedidosHistorico.value = response.pedidos || [];
  } catch (error) {
    erroApi.value = "Falha ao carregar o histórico.";
  } finally {
    isLoading.value = false;
  }
});

function verDetalhesDoPedido(pedidoId) {
  router.push(`/hospede/historico/${pedidoId}`);
}
</script>

<style scoped>
.paginaHistorico {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
}

.tituloHistorico {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1a202c;
  text-align: center;
}

.listaPedidos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 40px;
  padding: 24px 0 24px 0;
  max-width: 1000px;
  margin: 0 auto;
}

.carregando,
.erro,
.sem-pedidos {
  text-align: center;
  margin-top: 40px;
  color: #888;
}
</style>
