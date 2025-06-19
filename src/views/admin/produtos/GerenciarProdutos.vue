<template>
  <div class="containerPagina">
    <div class="cabecalho">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Produtos" />

      <FiltroGenerico
        :items="listaProdutos"
        filter-key="categoria"
        title="Filtrar por Categoria"
        @update:filtered-items="produtosFiltrados = $event"
      >
        <template #default="{ opcoes, selecaoTemporaria, updateSelecao }">
          <div class="opcoes-filtro-checkbox">
            <label v-for="categoria in opcoes" :key="categoria" class="checkbox-label">
              <input
                type="checkbox"
                :value="categoria"
                :checked="selecaoTemporaria.includes(categoria)"
                @change="toggleSelecao(categoria, selecaoTemporaria, updateSelecao)"
              />
              <span>{{ categoria }}</span>
            </label>
          </div>
        </template>
      </FiltroGenerico>
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

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import FiltroGenerico from '@/components/FiltroGenerico.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import CardProduto from '@/components/cards/CardProduto.vue'

const router = useRouter()

const listaProdutos = ref([
  { id: 1, titulo: 'Pão Francês', descricao: 'Crosta crocante e interior macio.', imagem: 'pao-frances.jpg', categoria: 'Padaria' },
  { id: 2, titulo: 'Croissant', descricao: 'Massa folhada amanteigada.', imagem: 'croissant.jpg', categoria: 'Padaria' },
  { id: 3, titulo: 'Brioche', descricao: 'Pão doce francês.', imagem: 'brioche.jpg', categoria: 'Padaria' },
  { id: 4, titulo: 'Café Preto', descricao: 'Forte e quente.', imagem: 'cafe.jpg', categoria: 'Bebidas' },
  { id: 5, titulo: 'Suco de Laranja', descricao: 'Natural e gelado.', imagem: 'suco.jpg', categoria: 'Bebidas' },
  { id: 6, titulo: 'Ovos Mexidos', descricao: 'Com sal e cheiro verde.', imagem: 'ovos.jpg', categoria: 'Pratos Quentes' },
  { id: 7, titulo: 'Tapioca', descricao: 'Recheada com queijo.', imagem: 'tapioca.jpg', categoria: 'Pratos Quentes' },
])

const produtosFiltrados = ref(listaProdutos.value)

const produtosPorCategoria = computed(() => {
  if (!produtosFiltrados.value) return {}
  return produtosFiltrados.value.reduce((acc, produto) => {
    const categoria = produto.categoria
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(produto)
    return acc
  }, {})
})

function toggleSelecao(item, selecaoAtual, updateFn) {
  const novaSelecao = [...selecaoAtual]
  const index = novaSelecao.indexOf(item)

  if (index > -1) {
    novaSelecao.splice(index, 1)
  } else {
    novaSelecao.push(item)
  }
  
  updateFn(novaSelecao)
}
</script>

<style scoped>
.containerPagina {
  padding: 24px 16px 0 16px;
  margin: 0 auto;
  max-width: 900px;
}
.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.opcoes-filtro-checkbox {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;
}
.checkbox-label input {
  width: 18px;
  height: 18px;
}
.blocoCategoria {
  width: 100%;
}
.tituloCategoria {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #27272a;
}
.itensCategoria {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>