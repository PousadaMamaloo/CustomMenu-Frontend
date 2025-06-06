<template>
  <div class="containerPedido">
    <div class="tituloAdicionar">
      <BotaoVoltar destino="/" textPage="Gerenciar Produto" />
      <div class="botoesDeAcao">
        <botaoAdicionar @click="adicionar" />
        <botaoFiltro ref="filtroBtn" @click="abrirModalFiltro = true" />
      </div>
    </div>
    <div class="tituloFiltro">
      <ModalFiltroCategorias v-if="abrirModalFiltro" :aberto="abrirModalFiltro" :categorias="categoriasDisponiveis"
        :selecionadas="categoriasSelecionadas" :anchor="anchorEl" @update:selecionadas="categoriasSelecionadas = $event"
        @close="abrirModalFiltro = false" />
    </div>
    <ContainerCards :items="Object.entries(produtosPorCategoria)">
      <template #default="{ item }">
        <div class="blocoCategoria">
          <h2 class="tituloCategoria">{{ item[0] }}</h2>
          <div class="itensCategoria">
            <CardProduto v-for="produto in item[1]" :key="produto.id" :dados="produto" />
          </div>
        </div>
      </template>
    </ContainerCards>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import botaoAdicionar from '@/components/botoes/botaoAdicionar.vue'
import botaoFiltro from '@/components/botoes/botaoFiltro.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import ModalFiltroCategorias from '@/components/modal/ModalFiltroCategorias.vue'
import CardProduto from '@/components/cards/CardProduto.vue'

const router = useRouter()
const route = useRoute()

const abrirModalFiltro = ref(false)
const categoriasSelecionadas = ref([])

const filtroBtn = ref(null)
const anchorEl = computed(() => filtroBtn.value && filtroBtn.value.$el ? filtroBtn.value.$el : filtroBtn.value)

function adicionar() {
  router.push('/admin/produto/cadastro')
}

const mostrarDialogSucesso = ref(route.query.sucesso === '1')

onMounted(() => {
  if (mostrarDialogSucesso.value) {
    setTimeout(() => {
      mostrarDialogSucesso.value = false
    }, 4000)
  }
})

// Este array deve vir da API futuramente
const listaProdutos = [
  { id: 1, titulo: 'Pão Francês', descricao: 'Crosta crocante e interior macio.', imagem: 'pao-frances.jpg', categoria: 'Padaria' },
  { id: 2, titulo: 'Croissant', descricao: 'Massa folhada amanteigada.', imagem: 'croissant.jpg', categoria: 'Padaria' },
  { id: 3, titulo: 'Brioche', descricao: 'Pão doce francês.', imagem: 'brioche.jpg', categoria: 'Padaria' },
  { id: 4, titulo: 'Café Preto', descricao: 'Forte e quente.', imagem: 'cafe.jpg', categoria: 'Bebidas' },
  { id: 5, titulo: 'Suco de Laranja', descricao: 'Natural e gelado.', imagem: 'suco.jpg', categoria: 'Bebidas' },
  { id: 6, titulo: 'Ovos Mexidos', descricao: 'Com sal e cheiro verde.', imagem: 'ovos.jpg', categoria: 'Pratos Quentes' },
  { id: 7, titulo: 'Tapioca', descricao: 'Recheada com queijo.', imagem: 'tapioca.jpg', categoria: 'Pratos Quentes' },
  { id: 8, titulo: 'Cuscuz Recheado', descricao: 'Com ovo e queijo.', imagem: 'cuscuz.jpg', categoria: 'Pratos Quentes' },
  { id: 9, titulo: 'Misto Quente', descricao: 'Presunto e queijo.', imagem: 'misto.jpg', categoria: 'Pratos Quentes' },
  { id: 10, titulo: 'Omelete', descricao: 'Com legumes.', imagem: 'omelete.jpg', categoria: 'Pratos Quentes' },
  { id: 11, titulo: 'Salada de Frutas', descricao: 'Fresca e colorida.', imagem: 'frutas.jpg', categoria: 'Frutas' }
]

const categoriasDisponiveis = computed(() => {
  return [...new Set(listaProdutos.map(p => p.categoria))]
})

const produtosFiltrados = computed(() => {
  if (!categoriasSelecionadas.value.length) return listaProdutos
  return listaProdutos.filter(p => categoriasSelecionadas.value.includes(p.categoria))
})

const produtosPorCategoria = computed(() => {
  return produtosFiltrados.value.reduce((acc, produto) => {
    if (!acc[produto.categoria]) acc[produto.categoria] = []
    acc[produto.categoria].push(produto)
    return acc
  }, {})
})
</script>

<style scoped>
.containerPedido {
  padding: 24px 16px 0 16px;
  margin: 0 auto;
  max-width: 900px;
  box-sizing: border-box;
}

.tituloAdicionar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.botoesDeAcao {
  display: flex;
  gap: 15px;
}

.tituloFiltro {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tituloPagina {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tituloProdutos {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.gridCategorias {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.blocoCategoria {
  /* padding removido para não recuar os cards */
  border-radius: 12px;
  width: 100%;
}

.tituloCategoria {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #27272a;
  text-align: left;
  margin-left: 0;
}

.itensCategoria {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  justify-content: flex-start;
}

.baseCard,
.BaseCard,
.componenteQuartos {
  flex: 1 1 350px;
  max-width: 400px;
  min-width: 350px;
  box-sizing: border-box;
  margin-bottom: 0;
}

/* Garante que em telas pequenas os cards ocupem 100% */
@media (max-width: 800px) {

  .baseCard,
  .BaseCard,
  .componenteQuartos {
    flex-basis: 100%;
    max-width: 100%;
    min-width: 0;
  }
}

@media (min-width: 1200px) {
  .gridCategorias {
    gap: 32px;
  }
}

@media (min-width: 769px) {
  .tituloPagina {
    font-size: 24px;
  }
}
</style>