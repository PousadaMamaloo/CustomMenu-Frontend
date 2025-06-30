<template>
  <div class="paginaCardapioRefeicao">
    <BotaoVoltar destino="/admin/refeicao" :textPage="`${titulo}`" />

    <Loading v-if="carregando" />

    <div v-else class="conteudoRefeicao">
      <div class="colunaEsquerda">
        <div class="infoEvento">
          <h2>{{ evento.nome_evento }}</h2>
          <p v-if="evento.desc_evento">{{ evento.desc_evento }}</p>
          <div class="statusEvento">
            Status: <span :class="['status', evento.sts_evento ? 'ativo' : 'inativo']">
              {{ evento.sts_evento ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
        </div>

        <div class="estatisticas">
          <div class="estatCard">
            <div class="estatNumero">{{ itensDisponiveis.length }}</div>
            <div class="estatLabel">Itens Disponíveis</div>
          </div>
          <div class="estatCard">
            <div class="estatNumero">{{ itensAssociados.length }}</div>
            <div class="estatLabel">Itens no Cardápio</div>
          </div>
        </div>

        <div class="filtros">
          <input v-model="filtroNome" type="text" placeholder="Buscar por nome..." class="inputFiltro" />
          <div class="filtroTipo">
            <label>
              <input v-model="mostrarApenas" type="radio" value="todos" />
              Todos os itens
            </label>
            <label>
              <input v-model="mostrarApenas" type="radio" value="associados" />
              Apenas associados
            </label>
            <label>
              <input v-model="mostrarApenas" type="radio" value="disponveis" />
              Apenas disponíveis
            </label>
          </div>
        </div>
      </div>

      <div class="colunaDireita">
        <div class="acoesBulk" v-if="itensFiltrados.length > 0">
          <button class="btnAssociarTodos" @click="associarTodosVisiveis" :disabled="processandoBulk">
            <i class="mdi mdi-plus-circle"></i>
            Associar Todos Visíveis
          </button>
          <button class="btnDesassociarTodos" @click="desassociarTodosVisiveis" :disabled="processandoBulk">
            <i class="mdi mdi-minus-circle"></i>
            Desassociar Todos Visíveis
          </button>
        </div>

        <div v-if="itensFiltrados.length > 0" class="listaItens">
          <CardItemCardapio v-for="item in itensFiltrados" :key="item.id" :item="item"
            :selecionado="isItemAssociado(item.id)" :processando="itensProcessando.includes(item.id)"
            @selecionar="toggleItem(item)" />
        </div>

        <div v-else class="sem-produtos">
          <p v-if="carregandoItens">Carregando itens...</p>
          <p v-else-if="filtroNome || mostrarApenas !== 'todos'">
            Nenhum item encontrado com os filtros aplicados.
          </p>
          <p v-else>Nenhum produto disponível para o cardápio.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import CardItemCardapio from '@/components/cards/cardItemCardapio.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import Loading from '@/components/Loading.vue'
import EventoService from '@/services/EventoService'
import ProdutoService from '@/services/ProdutoService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const eventoId = route.params.id
const carregando = ref(true)
const carregandoItens = ref(false)
const processandoBulk = ref(false)
const evento = ref({})
const itensDisponiveis = ref([])
const itensAssociados = ref([])
const itensProcessando = ref([])

// Filtros
const filtroNome = ref('')
const mostrarApenas = ref('todos')

// Computed para o título da página
const titulo = computed(() => {
  if (evento.value.nome_evento) {
    return `Cardápio - ${evento.value.nome_evento}`
  }
  return 'Cardápio do Evento'
})

// Computed para itens filtrados
const itensFiltrados = computed(() => {
  let itens = itensDisponiveis.value

  // Filtro por nome
  if (filtroNome.value) {
    const filtro = filtroNome.value.toLowerCase()
    itens = itens.filter(item =>
      (item.nome || '').toLowerCase().includes(filtro) ||
      (item.descricao || '').toLowerCase().includes(filtro)
    )
  }

  // Filtro por tipo
  if (mostrarApenas.value === 'associados') {
    itens = itens.filter(item => isItemAssociado(item.id))
  } else if (mostrarApenas.value === 'disponveis') {
    itens = itens.filter(item => !isItemAssociado(item.id))
  }

  return itens
})

onMounted(async () => {
  try {
    if (!eventoId) {
      toast.error("ID do evento não encontrado")
      router.push('/admin/refeicao')
      return
    }

    await carregarDados()
  } catch (error) {
    toast.error("Falha ao carregar os dados do evento")
    router.push('/admin/refeicao')
  } finally {
    carregando.value = false
  }
})

async function carregarDados() {
  try {
    carregando.value = true

    // Carregar dados do evento
    const eventoData = await EventoService.buscarPorId(eventoId)
    if (!eventoData) {
      toast.error('Evento não encontrado')
      router.push('/admin/refeicao')
      return
    }
    evento.value = eventoData

    // Carregar todos os itens disponíveis e itens já associados ao evento
    await Promise.all([
      carregarItensDisponiveis(),
      carregarItensAssociados()
    ])

  } catch (error) {
    toast.error('Erro ao carregar dados do evento')
    router.push('/admin/refeicao')
    throw error
  }
}

async function carregarItensDisponiveis() {
  try {
    carregandoItens.value = true
    const produtosData = await ProdutoService.listarTodosProdutos()

    // Padronizar formato dos itens
    itensDisponiveis.value = (produtosData || []).map(produto => ({
      id: produto.id_item || produto.id_produto || produto.id,
      nome: produto.nome_item || produto.nome_produto || produto.nome,
      descricao: produto.desc_item || produto.desc_produto || produto.descricao,
      foto: produto.foto_item || produto.foto_produto || produto.foto || '/quarto_placeholder.png',
      preco: produto.preco_item || produto.preco_produto || produto.preco || 0,
      categoria: produto.categoria_item || produto.categoria_produto || produto.categoria
    }))
  } catch (error) {
    toast.error('Erro ao carregar lista de produtos')
  } finally {
    carregandoItens.value = false
  }
}

async function carregarItensAssociados() {
  try {
    // Usar a rota específica de itens do evento conforme documentação
    const itensDoEvento = await EventoService.buscarCardapio(eventoId)

    // A resposta da API já contém apenas os itens associados ao evento
    if (itensDoEvento && Array.isArray(itensDoEvento)) {
      // Converter para o formato interno, extraindo apenas os IDs dos itens
      itensAssociados.value = itensDoEvento.map(item => ({
        itemId: item.id || item.id_item, // ID do item retornado pela API
        item: item
      }))

    } else {
      toast.warn('Nenhum item associado encontrado')
      itensAssociados.value = []
    }
  } catch (error) {
    toast.error('Erro ao carregar itens associados')
    // Não é um erro fatal, apenas começamos com cardápio vazio
    itensAssociados.value = []
  }
}

function isItemAssociado(itemId) {
  const associado = itensAssociados.value.some(assoc =>
    assoc.itemId === itemId || assoc.itemId == itemId
  )
  return associado
}

async function toggleItem(item) {
  if (itensProcessando.value.includes(item.id)) {
    return // Item já sendo processado
  }

  try {
    itensProcessando.value.push(item.id)

    if (isItemAssociado(item.id)) {
      await desassociarItem(item)
    } else {
      await associarItem(item)
    }
  } catch (error) {
    toast.error(`Erro ao ${isItemAssociado(item.id) ? 'remover' : 'adicionar'} item: ${item.nome}`)
  } finally {
    itensProcessando.value = itensProcessando.value.filter(id => id !== item.id)
  }
}

async function associarItem(item) {
  try {
    const response = await EventoService.associarItem(eventoId, item.id)

    if (response) {
      // Adicionar à lista de associados local
      itensAssociados.value.push({
        itemId: item.id,
        item: item
      })

      toast.success(`Item "${item.nome}" adicionado ao cardápio`)
    }
  } catch (error) {
    toast.error(`Erro ao associar "${item.nome}" ao cardápio`)
    throw error
  }
}

async function desassociarItem(item) {
  try {
    await EventoService.desassociarItem(eventoId, item.id)
    // Remover da lista de associados local
    itensAssociados.value = itensAssociados.value.filter(assoc => assoc.itemId !== item.id)
    toast.success(`Item "${item.nome}" removido do cardápio`)
  } catch (error) {
    toast.error(`Erro ao desvincular "${item.nome}" do cardápio`)
    // Recarregar a lista em caso de erro para manter sincronização
    await sincronizarComBackend()
    throw error
  }
}

async function associarTodosVisiveis() {
  if (processandoBulk.value) return

  const itensParaAssociar = itensFiltrados.value.filter(item => !isItemAssociado(item.id))

  if (itensParaAssociar.length === 0) {
    toast.info('Todos os itens visíveis já estão associados')
    return
  }

  try {
    processandoBulk.value = true

    for (const item of itensParaAssociar) {
      await associarItem(item)
    }

    toast.success(`${itensParaAssociar.length} itens adicionados ao cardápio`)
  } catch (error) {
    toast.error('Erro ao associar itens em lote')
  } finally {
    processandoBulk.value = false
  }
}

async function desassociarTodosVisiveis() {
  if (processandoBulk.value) return

  const itensParaDesassociar = itensFiltrados.value.filter(item => isItemAssociado(item.id))

  if (itensParaDesassociar.length === 0) {
    toast.info('Nenhum item visível está associado')
    return
  }

  const result = await Swal.fire({
    title: 'Remover Itens do Cardápio',
    text: `Confirma a remoção de ${itensParaDesassociar.length} itens do cardápio?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD7373',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, remover!',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) {
    return
  }

  try {
    processandoBulk.value = true
    let sucessos = 0
    let erros = 0

    for (const item of itensParaDesassociar) {
      try {
        await desassociarItem(item)
        sucessos++
      } catch (error) {
        erros++
        toast.error(`Erro ao desassociar "${item.nome}" do cardápio`)
      }
    }

    if (sucessos > 0) {
      toast.success(`${sucessos} itens removidos do cardápio`)
    }
    if (erros > 0) {
      toast.error(`${erros} itens não puderam ser removidos`)
    }
  } catch (error) {
    toast.error('Erro ao desassociar itens em lote')
  } finally {
    processandoBulk.value = false
  }
}

function irParaHistorico() {
  router.push('/admin/historico-pedidos')
}

// Função auxiliar para recarregar e sincronizar estado
async function sincronizarComBackend() {
  try {
    await carregarItensAssociados()
  } catch (error) {
    toast.error('Erro ao sincronizar com o backend')
  }
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

.infoEvento {
  background: linear-gradient(135deg, #f8a953, #d48946);
  color: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.infoEvento h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.infoEvento p {
  margin: 0 0 12px 0;
  opacity: 0.9;
  font-size: 16px;
}

.statusEvento {
  font-size: 14px;
  font-weight: 500;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.status.ativo {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
}

.status.inativo {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.estatisticas {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.estatCard {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.estatNumero {
  font-size: 32px;
  font-weight: 700;
  color: #f8a953;
  margin-bottom: 4px;
}

.estatLabel {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.filtros {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.inputFiltro {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
}

.inputFiltro:focus {
  outline: none;
  border-color: #f8a953;
  box-shadow: 0 0 0 3px rgba(248, 169, 83, 0.1);
}

.filtroTipo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtroTipo label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.filtroTipo input[type="radio"] {
  accent-color: #f8a953;
}

.acoesBulk {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btnAssociarTodos,
.btnDesassociarTodos {
  flex: 1;
  min-width: 180px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btnAssociarTodos {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btnAssociarTodos:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
}

.btnDesassociarTodos {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btnDesassociarTodos:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
}

.btnAssociarTodos:disabled,
.btnDesassociarTodos:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.listaItens {
  display: grid;
  gap: 16px;
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
    max-width: 800px;
  }

  .filtroTipo {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .acoesBulk {
    flex-wrap: nowrap;
  }

  .btnAssociarTodos,
  .btnDesassociarTodos {
    min-width: 160px;
  }
}

@media (min-width: 1024px) {
  .listaItens {
    grid-template-columns: repeat(2, 1fr);
  }
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
</style>
