<template>
  <div class="paginaPedido">
    <BotaoVoltar destino="/hospede/home" textPage="Voltar para Listagem de Eventos" />

    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>A carregar os detalhes do seu pedido...</p>
    </div>

    <div v-else-if="erroCarregamento" class="error-container">
      <p>Erro ao carregar os dados do evento. Por favor, tente novamente.</p>
      <button @click="router.push('/hospede/home')" class="botao-voltar">Voltar para Home</button>
    </div>

    <div v-else class="conteudoPedido">
      <!-- Coluna da Esquerda com os componentes de resumo e ações -->
      <div class="colunaEsquerda">
        <InfoEvento :evento="evento" :data-atual="dataAtual" />
        <SelecaoHorario :horarios="horarios" :horario-selecionado="pedidoState.horario"
          @update:horarioSelecionado="pedidoState.horario = $event" />
        <ResumoPedido :itens="pedidoState.itens" />
        <ObservacoesPedido v-model="pedidoState.observacao" />
      </div>

      <!-- Coluna da Direita com a lista de itens -->
      <div class="colunaDireita">
        <ListaItensPedido :itens="pedidoState.itens" @update:quantidade="atualizarQuantidadeItem" />
      </div>
    </div>

    <!-- Botões de Ação ficam no final, fora da grid principal -->
    <AcoesPedido v-if="!carregando && !erroCarregamento" :enviando="enviando" :editando="!!pedidoEmEdicao"
      :pode-enviar="podeEnviarPedido" @enviar="enviarPedido" @excluir="excluirPedido" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import CardapioService from '@/services/CardapioService';
import PedidoHospedeService from '@/services/PedidoHospedeService';
import SelecaoHorario from '@/components/pedido/SelecaoHorario.vue';
import ResumoPedido from '@/components/pedido/ResumoPedido.vue';
import ObservacoesPedido from '@/components/pedido/ObservacoesPedido.vue';
import ListaItensPedido from '@/components/pedido/ListaItensPedido.vue';
import AcoesPedido from '@/components/pedido/AcoesPedido.vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import InfoEvento from '@/components/pedido/InfoEvento.vue';

/**
 * View principal para o hóspede realizar ou editar um pedido.
 * A página é dividida em duas colunas: à esquerda, o resumo do pedido,
 * seleção de horário e observações; à direita, a lista de itens do
 * cardápio para seleção.
 */

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// Estado do Componente
const carregando = ref(true);
const erroCarregamento = ref(false);
const enviando = ref(false);
const evento = ref(null);
const pedidoEmEdicao = ref(null);

// Estado reativo para o pedido (formulário)
const pedidoState = reactive({
  horario: null,
  observacao: '',
  itens: [],
});

// Helper para obter a data de hoje no formato YYYY-MM-DD
const getTodayISO = () => new Date().toISOString().split('T')[0];

// Propriedades Computadas
const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const horarios = computed(() => evento.value?.horarios || []);
const podeEnviarPedido = computed(() => pedidoState.horario && pedidoState.itens.some(item => item.quantidade > 0));

// Funções do Ciclo de Vida
onMounted(async () => {
  console.log(authStore.user);
  const eventoId = parseInt(route.query.evento);
  const numQuarto = authStore.user?.num_quarto;
  const dataDeHoje = getTodayISO();

  if (!eventoId || !numQuarto) {
    toast.error("Informações de evento ou quarto inválidas.");
    router.push('/hospede/home');
    return;
  }

  try {
    // CORREÇÃO: Usa a nova rota para buscar o pedido do dia.
    const [dadosEvento, pedidoDoDia] = await Promise.all([
      CardapioService.listarItensPorEvento(eventoId),
      PedidoHospedeService.obterPedidoDoDia(eventoId, numQuarto, dataDeHoje)
    ]);

    if (dadosEvento?.data) {
      const dados = dadosEvento.data;
      evento.value = { ...dados, id_evento: eventoId };
      pedidoState.itens = (dados.itens || []).map(item => ({ ...item, quantidade: 0 }));
    } else {
      throw new Error('Estrutura de dados do evento inválida.');
    }

    // Se um pedido foi encontrado para hoje, carrega-o para edição.
    if (pedidoDoDia) {
      carregarPedidoParaEdicao(pedidoDoDia);
    }

  } catch (error) {
    toast.error("Não foi possível carregar os dados do pedido.");
    erroCarregamento.value = true;
  } finally {
    carregando.value = false;
  }
});

// Métodos
function carregarPedidoParaEdicao(pedido) {
  pedidoEmEdicao.value = pedido;
  pedidoState.observacao = pedido.obs_pedido || '';
  pedidoState.horario = horarios.value.find(h => h.id_horario === pedido.id_horario) || null;

  const itensMap = new Map(pedido.itens.map(item => [item.id_item, item.quantidade]));
  pedidoState.itens.forEach(item => {
    item.quantidade = itensMap.get(item.id_item) || 0;
  });

  toast.info("O seu pedido anterior foi carregado para edição.");
}

function atualizarQuantidadeItem({ itemId, novaQuantidade }) {
  const item = pedidoState.itens.find(i => i.id_item === itemId);
  if (item) {
    item.quantidade = novaQuantidade;
  }
}

async function enviarPedido() {
  if (!podeEnviarPedido.value) {
    toast.warning('Por favor, selecione um horário e pelo menos um item.');
    return;
  }

  const itensParaEnvio = pedidoState.itens
    .filter(item => item.quantidade > 0)
    .map(item => {
      const maxGratuitaItem = item.qtd_max_item || 0;

      return {
        id_item: item.id_item,
        qntd_item: item.quantidade,
      };
    });

  enviando.value = true;
  try {
    const isEditing = !!pedidoEmEdicao.value;
    if (isEditing) {
      const payloadAtualizacao = {
        id_horario: pedidoState.horario.id_horario,
        obs_pedido: pedidoState.observacao || "",
        itens: itensParaEnvio
      };
      await PedidoHospedeService.atualizarPedido(pedidoEmEdicao.value.id_pedido, payloadAtualizacao);
      toast.success('Pedido atualizado com sucesso!');
    } else {
      const payloadCriacao = {
        id_quarto: authStore.user.id_quarto,
        id_evento: evento.value.id_evento,
        id_horario: pedidoState.horario.id_horario,
        obs_pedido: pedidoState.observacao || "",
        itens: itensParaEnvio
      };
      await PedidoHospedeService.criarPedido(payloadCriacao);
      toast.success('Pedido enviado com sucesso!');
    }
    router.push('/hospede/home');
  } catch (error) {
    toast.error(`Erro ao ${pedidoEmEdicao.value ? 'atualizar' : 'enviar'} o pedido.`);
  } finally {
    enviando.value = false;
  }
}

async function excluirPedido() {
  if (!pedidoEmEdicao.value) return;

  const result = await Swal.fire({
    title: 'Cancelar Pedido?',
    text: "Esta ação não pode ser desfeita.",
    icon: 'warning',
    showCancelButton: false,
    confirmButtonColor: '#e74c3c',
    confirmButtonText: 'Sim, cancelar!'
  });

  if (result.isConfirmed) {
    enviando.value = true;
    try {
      await PedidoHospedeService.excluirPedido(pedidoEmEdicao.value.id_pedido);
      toast.success('Pedido excluído com sucesso!');
      router.push('/hospede/home');
    } catch (error) {
      toast.error('Erro ao excluir o pedido.');
    } finally {
      enviando.value = false;
    }
  }
}
</script>

<style scoped>
.paginaPedido {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f8a953;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-container .botao-voltar {
  background: #f8a953;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
}

.conteudoPedido {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.colunaEsquerda {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 992px) {
  .conteudoPedido {
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
  }

  .colunaEsquerda {
    width: 420px;
    flex-shrink: 0;
    position: sticky;
    top: 24px;
  }

  .colunaDireita {
    flex: 1;
  }
}
</style>