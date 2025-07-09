<template>
  <Loading v-if="isLoading" />

  <div class="containerPedido">
    <div class="tituloAdicionar">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Produto" />
      <div class="botoesDeAcao">
        <botaoAdicionar @click="adicionar" />
        <FiltroGenerico :items="listaProdutos" filter-key="categ_item" title="Filtrar por Categoria"
          @update:filtered-items="produtosFiltrados = $event">
          <template #default="{ selecaoTemporaria, updateSelecao }">
            <div class="opcoes-filtro">
              <button :class="['botao-opcao', { ativo: !selecaoTemporaria.length }]" @click="updateSelecao([])">
                Todos
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Pratos quentes feitos na hora') }]"
                @click="updateSelecao(['Pratos quentes feitos na hora'])">
                Pratos quentes feitos na hora
              </button>
              <button
                :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Acompanhamentos p/ os pratos quentes') }]"
                @click="updateSelecao(['Acompanhamentos p/ os pratos quentes'])">
                Acompanhamentos p/ os pratos quentes
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Padaria, forno e sobremesa') }]"
                @click="updateSelecao(['Padaria, forno e sobremesa'])">
                Padaria, forno e sobremesa
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Complementos essenciais') }]"
                @click="updateSelecao(['Complementos essenciais'])">
                Complementos essenciais
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Frutas') }]"
                @click="updateSelecao(['Frutas'])">
                Frutas
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria.includes('Para beber') }]"
                @click="updateSelecao(['Para beber'])">
                Para beber
              </button>
            </div>
          </template>
        </FiltroGenerico>
      </div>
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
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import FiltroGenerico from '@/components/FiltroGenerico.vue'
import CardProduto from '@/components/cards/CardProduto.vue'
import ProdutoService from '@/services/ProdutoService'
import Loading from '@/components/Loading.vue'

const isLoading = ref(true);
const router = useRouter()
const route = useRoute()

const listaProdutos = ref([])
const produtosFiltrados = ref([])

function adicionar() {
  router.push('/admin/produto/cadastro')
}

// const mostrarDialogSucesso = ref(route.query.sucesso === '1')

onMounted(async () => {
  // if (mostrarDialogSucesso.value) {
  //   setTimeout(() => {
  //     mostrarDialogSucesso.value = false
  //   }, 4000)
  // }
  try {
    const produtos = await ProdutoService.listarTodosProdutos();
    listaProdutos.value = produtos;
    produtosFiltrados.value = produtos; // Inicializa com todos os produtos
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
})

const produtosPorCategoria = computed(() => {
  return produtosFiltrados.value.reduce((acc, produto) => {
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

.opcoes-filtro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.botao-opcao {
  width: 100%;
  padding: 12px;
  text-align: left;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.botao-opcao.ativo {
  background-color: #fff8f0;
  border-color: #f8a953;
  font-weight: bold;
}

.opcoes-filtro-coluna {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opcao-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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