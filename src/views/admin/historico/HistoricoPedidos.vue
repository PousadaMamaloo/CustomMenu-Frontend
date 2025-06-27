<template>
  <div class="paginaHistorico">
    <div class="cabecalhoHistorico">
      <BotaoVoltar destino="/admin/pedidos" textPage="Histórico de Pedidos" />
      <div class="filtrosHistorico">
        <label>
          Data:
          <input type="date" v-model="dataFiltro" @change="buscarHistorico" />
        </label>
        <label class="checkboxQuarto">
          <input type="checkbox" v-model="filtrarPorQuarto" @change="buscarHistorico" />
          Agrupar por quarto
        </label>
      </div>
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando histórico...</p>
    </div>
    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>
    <div v-else-if="pedidosTabela.length > 0" class="containerTabela">
      <table class="tabelaPedidos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Quarto</th>
            <th>Evento</th>
            <th>Horário Café</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in pedidosTabela" :key="pedido.id_pedido">
            <td>{{ pedido.id_pedido }}</td>
            <td>{{ formatarData(pedido.data_pedido) }}</td>
            <td>{{ pedido.quarto }}</td>
            <td>{{ pedido.evento?.nome_evento || '-' }}</td>
            <td>{{ pedido.horario_cafe_manha || '-' }}</td>
            <td>
              <button class="botaoDetalhe" @click="verDetalhes(pedido.id_pedido)">
                <span class="mdi mdi-eye"></span> Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
import PedidoService from '@/services/PedidoService';

const router = useRouter();
const pedidosDoHistorico = ref([]);
const pedidosTabela = ref([]);
const paginaAtual = ref(1);
const totalPaginas = ref(1);
const itensPorPagina = ref(50);
const isLoading = ref(true);
const erroApi = ref(null);

const dataFiltro = ref('');
const filtrarPorQuarto = ref(false);

async function buscarHistorico() {
  isLoading.value = true;
  erroApi.value = null;
  try {
    const params = {
      page: paginaAtual.value,
      limit: itensPorPagina.value,
    };
    if (dataFiltro.value) params.data = dataFiltro.value;
    const response = await PedidoService.listarHistorico(params);
    if (response && response.pedidos) {
      pedidosDoHistorico.value = response.pedidos;
      totalPaginas.value = response.paginacao.total_paginas;
      aplicarFiltro();
    }
  } catch (error) {
    erroApi.value = "Falha ao carregar o histórico.";
  } finally {
    isLoading.value = false;
  }
}

function aplicarFiltro() {
  if (filtrarPorQuarto.value) {
    // Agrupa por quarto, mostra apenas o mais recente de cada quarto
    const agrupados = {};
    pedidosDoHistorico.value.forEach(pedido => {
      if (!agrupados[pedido.quarto] || new Date(pedido.data_pedido) > new Date(agrupados[pedido.quarto].data_pedido)) {
        agrupados[pedido.quarto] = pedido;
      }
    });
    pedidosTabela.value = Object.values(agrupados);
  } else {
    pedidosTabela.value = pedidosDoHistorico.value;
  }
}

onMounted(buscarHistorico);
watch([paginaAtual, dataFiltro, filtrarPorQuarto], buscarHistorico);

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
.paginaHistorico {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 12px 40px 12px;
}
.cabecalhoHistorico {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
}
.filtrosHistorico {
  display: flex;
  gap: 18px;
  align-items: center;
}
.checkboxQuarto {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
}
.tabelaPedidos {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px #0001;
}
.tabelaPedidos th, .tabelaPedidos td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.tabelaPedidos th {
  background: #f8a953;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}
.tabelaPedidos tr:last-child td {
  border-bottom: none;
}
.botaoDetalhe {
  background: #f8a953;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s;
}
.botaoDetalhe:hover {
  background: #ffb366;
}
.paginacao {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.sem-pedidos {
  text-align: center;
  margin-top: 60px;
  color: #bdbdbd;
  font-size: 18px;
  font-weight: 500;
}
.carregando, .erro {
  text-align: center;
  margin-top: 60px;
  font-size: 18px;
}
</style>