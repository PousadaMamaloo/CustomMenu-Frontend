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
            <CardProduto v-for="produto in item[1]" :key="produto.id" :dados="produto" />
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

const router = useRouter()
const route = useRoute()

// NOVO: Ref para armazenar os dados recebidos do componente filho
const produtosProcessados = ref({})

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

// Esta lista continua aqui, pois é a fonte de dados original
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

// REMOVIDO: Toda a lógica de filtro foi movida para o componente FiltroProdutos.
// As 'computed properties' 'categoriasDisponiveis', 'produtosFiltrados' e
// 'produtosPorCategoria' não existem mais aqui.
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