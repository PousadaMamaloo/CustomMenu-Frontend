<template>
        <Loading v-if="isLoading" />

  <div class="containerPedido">
    <div class="tituloAdicionar">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Produto" />
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
            <CardProduto v-for="produto in item[1]" :key="produto.id_item" :dados="produto" />
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
import ProdutoService from '@/services/ProdutoService'
import Loading from '@/components/Loading.vue'

const isLoading = ref(true);
const router = useRouter()
const route = useRoute()

const abrirModalFiltro = ref(false)
const categoriasSelecionadas = ref([])
const listaProdutos = ref([])

const filtroBtn = ref(null)
const anchorEl = computed(() => filtroBtn.value && filtroBtn.value.$el ? filtroBtn.value.$el : filtroBtn.value)

function adicionar() {
  router.push('/admin/produto/cadastro')
}

const mostrarDialogSucesso = ref(route.query.sucesso === '1')

onMounted(async () => {
  if (mostrarDialogSucesso.value) {
    setTimeout(() => {
      mostrarDialogSucesso.value = false
    }, 4000)
  }
  try {
    listaProdutos.value = await ProdutoService.listarTodosProdutos();
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error('Erro ao buscar produtos:', error)
  }
})

const categoriasDisponiveis = computed(() => {
  // Usa 'categ_item' que vem da API
  return [...new Set(listaProdutos.value.map(p => p.categ_item))]
})

const produtosFiltrados = computed(() => {
  if (!categoriasSelecionadas.value.length) return listaProdutos.value
  // Usa 'categ_item' para filtrar
  return listaProdutos.value.filter(p => categoriasSelecionadas.value.includes(p.categ_item))
})

const produtosPorCategoria = computed(() => {
  return produtosFiltrados.value.reduce((acc, produto) => {
    // Agrupa por 'categ_item'
    const categoria = produto.categ_item;
    if (!acc[categoria]) acc[categoria] = []
    acc[categoria].push(produto)
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