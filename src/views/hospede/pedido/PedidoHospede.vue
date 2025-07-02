<template>
  <div class="paginaPedido">
    <BotaoVoltar destino="/hospede/home" textPage="Voltar para Home" />

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
import Swal from 'sweetalert2';

import CardapioService from '@/services/CardapioService';
import PedidoHospedeService from '@/services/PedidoHospedeService';
import { useAuthStore } from '@/stores/auth';

import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import InfoEvento from '@/components/pedido/InfoEvento.vue';
import SelecaoHorario from '@/components/pedido/SelecaoHorario.vue';
import ResumoPedido from '@/components/pedido/ResumoPedido.vue';
import ObservacoesPedido from '@/components/pedido/ObservacoesPedido.vue';
import ListaItensPedido from '@/components/pedido/ListaItensPedido.vue';
import AcoesPedido from '@/components/pedido/AcoesPedido.vue';
import Loading from '@/components/Loading.vue';


const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const carregando = ref(true);
const erroCarregamento = ref(false);
const enviando = ref(false);
const evento = ref(null);
const pedidoEmEdicao = ref(null);

const pedidoState = reactive({
  horario: null,
  observacao: '',
  itens: [],
});

const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const horarios = computed(() => evento.value?.horarios || []);

// Computed para verificar se está dentro do horário permitido (das 10h às 22h)
const dentroDoHorarioPermitido = computed(() => {
  const agora = new Date();
  const horaAtual = agora.getHours();
  return horaAtual >= 10 && horaAtual < 22; // Permite pedidos apenas das 10h às 22h
});

const podeEnviarPedido = computed(() => {
  return pedidoState.horario &&
    pedidoState.itens.some(item => item.quantidade > 0) &&
    dentroDoHorarioPermitido.value;
});

onMounted(async () => {
  const eventoId = parseInt(route.query.evento);
  const numQuarto = authStore.user?.num_quarto;

  if (!eventoId || !numQuarto) {
    toast.error("Informações de evento ou quarto inválidas.");
    router.push('/hospede/home');
    return;
  }

  try {
    const [dadosEvento, pedidosExistentes] = await Promise.all([
      CardapioService.listarItensPorEvento(eventoId),
      PedidoHospedeService.listarPedidosPorQuarto(numQuarto)
    ]);

    if (dadosEvento?.data) {
      const dados = dadosEvento.data;
      evento.value = { ...dados, id_evento: eventoId };
      pedidoState.itens = (dados.itens || []).map(item => ({ ...item, quantidade: 0 }));
    } else {
      throw new Error('Estrutura de dados do evento inválida.');
    }

    const pedidoParaEsteEvento = pedidosExistentes.find(p => p.id_evento === eventoId);
    if (pedidoParaEsteEvento) {
      const detalhesPedido = await PedidoHospedeService.obterPedidoPorId(pedidoParaEsteEvento.id_pedido);
      if (detalhesPedido) {
        carregarPedidoParaEdicao(detalhesPedido);
      }
    }

  } catch (error) {
    console.error("Erro ao carregar dados da página:", error);
    toast.error("Não foi possível carregar os dados do pedido.");
    erroCarregamento.value = true;
  } finally {
    carregando.value = false;
  }
});

function carregarPedidoParaEdicao(pedido) {
  console.log("Carregando pedido para edição:", pedido);
  pedidoEmEdicao.value = pedido;
  pedidoState.observacao = pedido.obs_pedido || '';

  if (pedido.id_horario) {
    pedidoState.horario = horarios.value.find(h => h.id_horario === pedido.id_horario) || null;
  } else {
    pedidoState.horario = null;
  }

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
  // Validação de horário antes de processar o pedido
  if (!dentroDoHorarioPermitido.value) {
    await Swal.fire({
      title: 'Horário não permitido',
      text: 'Pedidos só podem ser realizados ou editados das 10:00 às 22:00. Tente novamente no horário permitido.',
      icon: 'warning',
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#f8a953'
    });
    return;
  }

  if (!podeEnviarPedido.value) {
    toast.warning('Por favor, selecione um horário e pelo menos um item.');
    return;
  }

  // Calcular valor total dos itens pagos
  const valorTotalPago = pedidoState.itens
    .filter(item => item.quantidade > 0)
    .reduce((total, item) => {
      const maxGratuitaItem = item.qtd_max_item || 0;
      const quantidadePaga = Math.max(0, item.quantidade - maxGratuitaItem);
      return total + (quantidadePaga * (item.valor_item || 0));
    }, 0);

  const itensParaEnvio = pedidoState.itens
    .filter(item => item.quantidade > 0)
    .map(item => {
      const maxGratuitaItem = item.qtd_max_item || 0;
      const quantidadePaga = Math.max(0, item.quantidade - maxGratuitaItem);
      const quantidadeGratuita = Math.min(item.quantidade, maxGratuitaItem);

      return {
        id_item: item.id_item,
        qntd_item: item.quantidade,
        qntd_gratuita: quantidadeGratuita,
        qntd_paga: quantidadePaga,
        valor_unitario: item.valor_item || 0,
        valor_total_item: quantidadePaga * (item.valor_item || 0)
      };
    });

  enviando.value = true;
  try {
    const isEditing = !!pedidoEmEdicao.value;
    if (isEditing) {
      const payloadAtualizacao = {
        id_horario: pedidoState.horario.id_horario,
        obs_pedido: pedidoState.observacao || "",
        valor_total_pago: valorTotalPago,
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
        valor_total_pago: valorTotalPago,
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

  // Validação de horário antes de excluir
  if (!dentroDoHorarioPermitido.value) {
    await Swal.fire({
      title: 'Horário não permitido',
      text: 'Pedidos só podem ser excluídos das 10:00 às 22:00. Entre em contato com a recepção se necessário.',
      icon: 'warning',
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#f8a953'
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Excluir Pedido?',
    text: "Esta ação não pode ser desfeita.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, excluir!'
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
