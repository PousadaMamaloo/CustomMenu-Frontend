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

      <!-- Filtro Quartos -->
      <div class="filtroCheckboxQuartos">
        <span style="font-weight:600;">Quartos:</span>
        <label v-for="quarto in quartosDisponiveis" :key="quarto" class="checkboxQuarto">
          <input
            type="checkbox"
            :value="quarto"
            v-model="quartosSelecionados"
          />
          {{ quarto }}
        </label>
      </div>

      <!-- Botão Limpar Filtros -->
      <button
        class="botaoLimpar"
        @click="limparFiltros">
        Limpar Filtros
      </button>
    </div>

    <div class="tabela-container">
      <table class="tabela-eventos">
        <thead>
          <tr>
            <th>Data do Evento</th>
            <th>Nome do Evento</th>
            <th>Quarto</th>
            <th>Observações</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventosFiltrados" :key="evento.id_pedido">
            <td>{{ formatarData(evento.data_pedido) }}</td>
            <td>{{ evento.evento?.nome_evento || 'Sem evento' }}</td>
            <td>{{ evento.quarto }}</td>
            <td style="white-space: pre-line;">{{ evento.observacoes || '-' }}</td>
            <td>
              <button
                class="botaoDetalhes"
                @click="verDetalhes(evento.id_pedido)"
              >
                Detalhes
              </button>
            </td>
          </tr>
          <tr v-if="eventosFiltrados.length === 0">
            <td colspan="5" style="text-align:center; color:#888;">Nenhum evento encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import PedidoService from '@/services/PedidoService';

// Filtros
const filtroEvento = ref('');
const filtroDataInicio = ref('');
const filtroDataFim = ref('');
const filtroQuarto = ref(''); // caso adicione filtro de quarto

// Dados
const eventos = ref([]);
const eventosDisponiveis = ref([]);
const quartosSelecionados = ref([]); // array de quartos selecionados

// Router
const router = useRouter();

// Buscar histórico ao montar
onMounted(async () => {
  const response = await PedidoService.listarHistorico({ limit: 1000 });
  eventos.value = response.pedidos || [];
  eventosDisponiveis.value = [
    ...new Set(eventos.value.map(e => e.evento?.nome_evento).filter(Boolean))
  ];
});

// Computed para filtrar os eventos
const eventosFiltrados = computed(() => {
  return eventos.value
    .filter(ev => {
      const eventoOk = !filtroEvento.value || (ev.evento?.nome_evento || '').toLowerCase().includes(filtroEvento.value.toLowerCase());
      let dataOk = true;
      const dataEvento = new Date(ev.data_pedido).toISOString().slice(0, 10);
      if (filtroDataInicio.value) {
        dataOk = dataOk && dataEvento >= filtroDataInicio.value;
      }
      if (filtroDataFim.value) {
        dataOk = dataOk && dataEvento <= filtroDataFim.value;
      }
      // Filtro por quartos selecionados
      const quartoOk = quartosSelecionados.value.length === 0 || quartosSelecionados.value.includes(String(ev.quarto));
      return eventoOk && dataOk && quartoOk;
    })
    .sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido));
});

// Computed para listar quartos disponíveis
const quartosDisponiveis = computed(() => {
  // Gera uma lista única de quartos presentes nos eventos
  return [...new Set(eventos.value.map(e => String(e.quarto)))].sort((a, b) => a - b);
});

// Função para formatar data
function formatarData(dataString) {
  if (!dataString) return '';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}

// Função para limpar filtros
function limparFiltros() {
  filtroEvento.value = '';
  filtroDataInicio.value = '';
  filtroDataFim.value = '';
  filtroQuarto.value = ''; // limpe aqui também se usar
}

// Ação para o botão de detalhes
function verDetalhes(id) {
  router.push({ name: 'DetalhePedidoHistorico', params: { id } });
}

style scoped>
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
  gap: 24px;
  margin-bottom: 32px;
  justify-content: center;
  align-items: flex-end;
  background: #fff7ed;
  border-radius: 10px;
  padding: 18px 18px 10px 18px;
  box-shadow: 0 2px 8px #0001;
}
.filtro {
  min-width: 180px;
  max-width: 220px;
  margin-bottom: 0;
}
input[type="date"].filtro {
  background: #fff;
  border: 1.5px solid #f8a953;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 15px;
  color: #333;
  transition: border 0.2s;
  outline: none;
  box-shadow: 0 1px 4px #f8a95322;
}
input[type="date"].filtro:focus {
  border-color: #ffa948;
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
  vertical-align: middle;
}
.tabela-eventos th {
  background: #f8a953;
  color: #fff;
  font-weight: 700;
}
.tabela-eventos tr:last-child td {
  border-bottom: none;
}
.botaoDetalhes {
  background: #f8a953;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.botaoDetalhes:hover {
  background: #ffa948;
}
.botaoLimpar {
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin-left: 8px;
}
.botaoLimpar:hover {
  background: #ffebcc;
  color: #ff9800;
}
.filtroCheckboxQuartos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  background: #fff3e0;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 1px 4px #f8a95311;
}
.filtroCheckboxQuartos > span {
  font-weight: 600;
  margin-right: 8px;
  color: #f8a953;
}
.checkboxQuarto {
  margin-right: 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}
.checkboxQuarto input[type="checkbox"] {
  accent-color: #f8a953;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}
.checkboxQuarto:hover {
  background: #ffe0b2;
}
</style>
