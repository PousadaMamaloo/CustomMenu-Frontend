<template>
  <div class="containerPedido">
    <div class="tituloAdicionar">
      <BotaoVoltar destino="/" textPage="Gerenciar Produto" />
      <div class="botoesDeAcao">
        <botaoAdicionar @click="adicionar" />
        <FiltroProdutos 
          :produtos="listaProdutos" 
          @update:produtos-filtrados="produtosProcessados = $event" 
        />
      </div>
    </div>
    
    <ContainerCards :items="Object.entries(produtosProcessados)">
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import botaoAdicionar from '@/components/botoes/botaoAdicionar.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import CardProduto from '@/components/cards/CardProduto.vue'
import FiltroProdutos from '@/components/FiltroProdutos.vue' // NOVO: Importando o componente
import ProdutoService from '@/services/ProdutoService'

const router = useRouter()
const route = useRoute()

// NOVO: Ref para armazenar os dados recebidos do componente filho
const produtosProcessados = ref({})

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
    listaProdutos.value = await ProdutoService.listarTodosProdutos()
  } catch (error) {
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
/* O seu CSS original permanece inalterado */
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

.blocoCategoria {
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
</style>