<template>
  <div class="paginaHistorico">
    <div class="cabecalhoHistorico">
      <BotaoVoltar destino="/admin/pedidos" textPage="Histórico de Eventos" />
    </div>

    <div class="filtrosHistorico">
      <!-- Filtro Nome do Evento -->
      <v-autocomplete
        v-model="filtroEvento"
        :items="eventosDisponiveis"
        label="Nome do Evento"
        clearable
        solo
        hide-details
        dense
        class="filtro"
        placeholder="Buscar evento..."
      />

      <!-- Filtro Data (intervalo) -->
      <input
        type="date"
        v-model="filtroDataInicio"
        class="filtro"
        :max="filtroDataFim || undefined"
        placeholder="Data inicial"
      />
      <span style="margin: 0 8px;">até</span>
      <input
        type="date"
        v-model="filtroDataFim"
        class="filtro"
        :min="filtroDataInicio || undefined"
        placeholder="Data final"
      />

      <!-- Filtro Quarto -->
      <v-autocomplete
        v-model="filtroQuarto"
        :items="quartosDisponiveis"
        label="Quarto"
        clearable
        solo
        hide-details
        dense
        class="filtro"
        placeholder="Buscar quarto..."
      />
    </div>

    <div class="tabela-container">
      <table class="tabela-eventos">
        <thead>
          <tr>
            <th>Data do Evento</th>
            <th>Nome do Evento</th>
            <th>Quarto</th>
            <th>Observações / Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventosFiltrados" :key="evento.id_pedido">
            <td>{{ formatarData(evento.data_pedido) }}</td>
            <td>{{ evento.evento?.nome_evento || 'Sem evento' }}</td>
            <td>{{ evento.quarto }}</td>
            <td>{{ evento.observacoes || '-' }}</td>
          </tr>
          <tr v-if="eventosFiltrados.length === 0">
            <td colspan="4" style="text-align:center; color:#888;">Nenhum evento encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';

// Filtros
const filtroEvento = ref('');
const filtroDataInicio = ref('');
const filtroDataFim = ref('');
const filtroQuarto = ref('');

// Dados
const eventos = ref([]);
const eventosDisponiveis = ref([]);
const quartosDisponiveis = Array.from({ length: 32 }, (_, i) => (i + 1).toString());

// Buscar histórico ao montar
onMounted(async () => {
  const response = await PedidoService.listarHistorico({ limit: 500 }); // Ajuste o limit conforme necessário
  eventos.value = response.pedidos || [];
  eventosDisponiveis.value = [
    ...new Set(eventos.value.map(e => e.evento?.nome_evento).filter(Boolean))
  ];
});

// Computed para filtrar os eventos
const eventosFiltrados = computed(() => {
  return eventos.value.filter(ev => {
    // Filtro por evento
    const eventoOk = !filtroEvento.value || (ev.evento?.nome_evento || '').toLowerCase().includes(filtroEvento.value.toLowerCase());
    // Filtro por quarto
    const quartoOk = !filtroQuarto.value || String(ev.quarto) === filtroQuarto.value;
    // Filtro por data
    let dataOk = true;
    if (filtroDataInicio.value) {
      dataOk = dataOk && ev.data_pedido.slice(0, 10) >= filtroDataInicio.value;
    }
    if (filtroDataFim.value) {
      dataOk = dataOk && ev.data_pedido.slice(0, 10) <= filtroDataFim.value;
    }
    return eventoOk && quartoOk && dataOk;
  });
});

// Função para formatar data
function formatarData(dataString) {
  if (!dataString) return '';
  const [ano, mes, dia] = dataString.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
</script>

<style scoped>
.paginaHistorico {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
}
.cabecalhoHistorico {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.filtrosHistorico {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 32px;
  justify-content: center;
  align-items: center;
}
.filtro {
  min-width: 180px;
  max-width: 220px;
}
.tabela-container {
  overflow-x: auto;
}
.tabela-eventos {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px #0001;
}
.tabela-eventos th, .tabela-eventos td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.tabela-eventos th {
  background: #f8a953;
  color: #fff;
  font-weight: 700;
}
.tabela-eventos tr:last-child td {
  border-bottom: none;
}
</style>