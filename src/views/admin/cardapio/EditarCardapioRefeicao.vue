<template>
  <div class="paginaCardapioRefeicao">
    <BotaoVoltar destino="/admin/refeicao" :textPage="`${titulo}`" />

    <Loading v-if="carregando" />

    <div v-else class="conteudoRefeicao">
      <div class="colunaEsquerda">
        <HorarioSelecao :horarios="horarios" :selecionado="horarioSelecionado" @update:selecionado="selecionarHorario"
          @adicionar="adicionarHorario" />
        <div class="boxHistorico">
          <BotaoHistorico @click="irParaHistorico" />
        </div>
      </div>
      <div class="colunaDireita">
        <div v-if="listaItens.length > 0">
          <CardItemCardapio v-for="item in listaItens" :key="item.id" :item="item"
            :selecionado="itensSelecionados.includes(item.id)" @selecionar="toggleItem(item.id)" />
        </div>
        <div v-else class="sem-produtos">
          <p>Nenhum produto disponível para o cardápio.</p>
        </div>
      </div>
    </div>

    <BotaoSalvar v-if="!carregando" :carregando="salvando" :texto="salvando ? 'Salvando...' : 'Salvar Cardápio'"
      @click="salvarCardapio" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import HorarioSelecao from '@/components/HorariosSelecao.vue'
import CardItemCardapio from '@/components/cards/cardItemCardapio.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue'
import BotaoHistorico from '@/components/botoes/botaoHistorico.vue'
import Loading from '@/components/Loading.vue'
import EventoService from '@/services/EventoService'
import ProdutoService from '@/services/ProdutoService'
import CardapioService from '@/services/CardapioService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const eventoId = route.params.id
const carregando = ref(true)
const salvando = ref(false)
const evento = ref({})
const produtos = ref([])
const itensSelecionados = ref([])
const horarios = ref(['7:00'])
const horarioSelecionado = ref('')

// Computed para o título da página
const titulo = computed(() => {
  if (evento.value.nome_evento) {
    return `Cardápio - ${evento.value.nome_evento}`
  }
  return 'Cardápio do Evento'
})

// Computed para lista de itens (produtos formatados)
const listaItens = computed(() => {
  return produtos.value.map(produto => ({
    id: produto.id_item || produto.id_produto || produto.id,
    nome: produto.nome_item || produto.nome_produto || produto.nome,
    descricao: produto.desc_item || produto.desc_produto || produto.descricao,
    foto: produto.foto_item || produto.foto_produto || produto.foto || '/quarto_placeholder.png'
  }))
})

onMounted(async () => {
  try {
    // Verificar se temos um ID válido
    if (!eventoId) {
      toast.error("ID do evento não encontrado")
      router.push('/admin/refeicao')
      return
    }

    await carregarDados()
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
    toast.error("Falha ao carregar os dados do evento")
    router.push('/admin/refeicao')
  } finally {
    carregando.value = false
  }
})

async function carregarDados() {
  try {
    carregando.value = true

    // Carregar dados do evento e produtos em paralelo
    const [eventoData, produtosData] = await Promise.all([
      EventoService.buscarPorId(eventoId),
      ProdutoService.listarProdutos()
    ])

    if (!eventoData) {
      toast.error('Evento não encontrado')
      router.push('/admin/refeicao')
      return
    }

    evento.value = eventoData
    produtos.value = produtosData || []

    // Configurar horários do evento
    if (eventoData.horarios && eventoData.horarios.length > 0) {
      horarios.value = eventoData.horarios.map(h => h.hora_inicio || h)
      horarioSelecionado.value = horarios.value[0]
    } else {
      // Horário padrão se não houver horários configurados
      horarios.value = ['7:00', '12:00', '19:00']
      horarioSelecionado.value = horarios.value[0]
    }

    // Carregar itens já selecionados no cardápio (se houver)
    await carregarCardapioExistente()

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    throw error
  }
}

async function carregarCardapioExistente() {
  try {
    // Buscar itens já vinculados ao evento
    const cardapioResponse = await CardapioService.listarItensPorEvento(eventoId)

    if (cardapioResponse && cardapioResponse.data && Array.isArray(cardapioResponse.data)) {
      // Extrair IDs dos itens já selecionados
      itensSelecionados.value = cardapioResponse.data.map(item =>
        item.id_item || item.id_produto || item.id
      )
    }
  } catch (error) {
    console.error('Erro ao carregar cardápio existente:', error)
    // Não é um erro fatal, apenas começamos com cardápio vazio
    itensSelecionados.value = []
  }
}

function selecionarHorario(h) {
  horarioSelecionado.value = h
}

function adicionarHorario() {
  const novoHorario = prompt('Digite o novo horário (formato: HH:MM):')
  if (novoHorario && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novoHorario)) {
    horarios.value.push(novoHorario)
    horarioSelecionado.value = novoHorario
  } else if (novoHorario) {
    toast.error('Formato de horário inválido. Use HH:MM')
  }
}

function toggleItem(id) {
  if (itensSelecionados.value.includes(id)) {
    itensSelecionados.value = itensSelecionados.value.filter(i => i !== id)
  } else {
    itensSelecionados.value.push(id)
  }
}

async function salvarCardapio() {
  try {
    if (itensSelecionados.value.length === 0) {
      toast.warning('Selecione pelo menos um item para o cardápio')
      return
    }

    salvando.value = true

    // Salvar cardápio usando o CardapioService
    await CardapioService.vincularItensAEvento(eventoId, itensSelecionados.value)

    toast.success('Cardápio salvo com sucesso!')

    // Opcional: redirecionar de volta para a lista de refeições
    // router.push('/admin/refeicao')

  } catch (error) {
    console.error('Erro ao salvar cardápio:', error)

    if (error.response && error.response.data && error.response.data.message) {
      toast.error(`Erro ao salvar: ${error.response.data.message}`)
    } else {
      toast.error('Erro ao salvar o cardápio. Tente novamente.')
    }
  } finally {
    salvando.value = false
  }
}

function irParaHistorico() {
  router.push('/admin/historico-pedidos')
}
</script>

<style scoped>
.paginaCardapioRefeicao {
  padding-inline: 20px;
  max-width: 1350px;
  margin: 0 auto;
}

.conteudoRefeicao {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.colunaEsquerda,
.colunaDireita {
  width: 100%;
}

.itemInfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

@media (min-width: 765px) {
  .conteudoRefeicao {
    flex-direction: row;
    gap: 44px;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .colunaEsquerda {
    width: 340px;
    min-width: 270px;
    max-width: 340px;
  }

  .colunaDireita {
    flex: 1;
    max-width: 620px;
  }
}

.subtitulo {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 18px;
}

.historicoBtn {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  border: none;
  padding: 18px 18px 14px 18px;
  font-size: 17px;
  font-weight: 600;
  gap: 16px;
  color: #1c1c1c;
  width: 100%;
  transition: background 0.18s;
  cursor: pointer;
}

.historicoBtn .mdi-history {
  font-size: 30px;
  margin-right: 8px;
  color: #222;
}

.histTit {
  font-size: 17px;
  font-weight: 600;
  display: block;
}

.histDesc {
  font-size: 14px;
  font-weight: 400;
  color: #888;
  margin-left: 0;
}

.historicoBtn .mdi-chevron-right {
  font-size: 27px;
  color: #b6b6b8;
  margin-left: auto;
}

.botaoSalvar {
  margin: 44px auto 0 auto;
  display: block;
  background: linear-gradient(90deg, #f8a953, #d48946 100%);
  color: white;
  border: none;
  padding: 16px 80px;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 600;
  transition: background 0.23s;
  box-shadow: 0 4px 22px #f8a95333;
  cursor: pointer;
  min-width: 170px;
}

.sem-produtos {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.sem-produtos p {
  margin: 0;
  color: #6c757d;
  font-size: 16px;
  font-weight: 500;
}

.boxHistorico {
  margin-top: 20px;
}
</style>
