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
      <CardPedido v-for="pedido in pedidosHistorico" :key="pedido.id_pedido" :id="pedido.id_pedido"
        :quarto="pedido.quarto" :total-itens="pedido.itens?.length || 0" :horario="pedido.horario_cafe_manha"
        @ver-mais="verDetalhesDoPedido(pedido.id_pedido)" />
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
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const pedidosHistorico = ref([]);
const isLoading = ref(true);
const erroApi = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    erroApi.value = null;

    const idHospede = authStore.user?.id_hospede;
    if (!idHospede) {
      erroApi.value = "Usuário não identificado. Faça o login novamente.";
      router.push('/hospede/login');
      return;
    }

    const pedidos = await PedidoService.listarHistoricoHospede(idHospede);
    pedidosHistorico.value = pedidos;
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    erroApi.value = "Falha ao carregar o histórico.";
  } finally {
    isLoading.value = false;
  }
});

function verDetalhesDoPedido(pedidoId) {
  toast.info('Detalhes do pedido ainda não implementados.');
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
