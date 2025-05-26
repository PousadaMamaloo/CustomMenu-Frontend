<template>
  <div class="containerPedido">
    <div class="tituloAdicionar">
      <h1 class="tituloPagina">Gerenciar Produto</h1>
      <button class="botaoAdicionar" @click="adicionar">Adicionar</button>
    </div>
    <div class="tituloFiltro">
      <h2 class="tituloProdutos">Produtos</h2>
      <botaoFiltro ref="filtroBtn" @click="abrirModalFiltro = true" />
      <ModalFiltroCategorias v-if="abrirModalFiltro" :aberto="abrirModalFiltro" :categorias="categoriasDisponiveis"
        :selecionadas="categoriasSelecionadas" :anchor="anchorEl" @update:selecionadas="categoriasSelecionadas = $event"
        @close="abrirModalFiltro = false" />
    </div>

    <ListaProdutos :produtos="produtosFiltrados" />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ListaProdutos from '../../../components/ListaProdutos.vue'
import botaoFiltro from '/src/components/botoes/botaoFiltro.vue'
import ModalFiltroCategorias from '/src/components/modal/ModalFiltroCategorias.vue'

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

const categoriasDisponiveis = computed(() => {
  return [...new Set(listaProdutos.map(p => p.categoria))]
})

const produtosFiltrados = computed(() => {
  // Se nada estiver marcado, retorna todos
  if (!categoriasSelecionadas.value.length) return listaProdutos
  return listaProdutos.filter(p => categoriasSelecionadas.value.includes(p.categoria))
})

// Este array deve vir da API futuramente
const listaProdutos = [
  // 🥐 Padaria (3 itens)
  { id: 1, titulo: 'Pão Francês', descricao: 'Crosta crocante e interior macio.', imagem: 'pao-frances.jpg', categoria: 'Padaria' },
  { id: 2, titulo: 'Croissant', descricao: 'Massa folhada amanteigada.', imagem: 'croissant.jpg', categoria: 'Padaria' },
  { id: 3, titulo: 'Brioche', descricao: 'Pão doce francês.', imagem: 'brioche.jpg', categoria: 'Padaria' },

  // ☕ Bebidas (2 itens)
  { id: 4, titulo: 'Café Preto', descricao: 'Forte e quente.', imagem: 'cafe.jpg', categoria: 'Bebidas' },
  { id: 5, titulo: 'Suco de Laranja', descricao: 'Natural e gelado.', imagem: 'suco.jpg', categoria: 'Bebidas' },

  // 🍳 Pratos Quentes (5 itens)
  { id: 6, titulo: 'Ovos Mexidos', descricao: 'Com sal e cheiro verde.', imagem: 'ovos.jpg', categoria: 'Pratos Quentes' },
  { id: 7, titulo: 'Tapioca', descricao: 'Recheada com queijo.', imagem: 'tapioca.jpg', categoria: 'Pratos Quentes' },
  { id: 8, titulo: 'Cuscuz Recheado', descricao: 'Com ovo e queijo.', imagem: 'cuscuz.jpg', categoria: 'Pratos Quentes' },
  { id: 9, titulo: 'Misto Quente', descricao: 'Presunto e queijo.', imagem: 'misto.jpg', categoria: 'Pratos Quentes' },
  { id: 10, titulo: 'Omelete', descricao: 'Com legumes.', imagem: 'omelete.jpg', categoria: 'Pratos Quentes' },

  // 🍓 Frutas (1 item)
  { id: 11, titulo: 'Salada de Frutas', descricao: 'Fresca e colorida.', imagem: 'frutas.jpg', categoria: 'Frutas' }
]
</script>

<style scoped>
.containerPedido {
  padding: 20px;
}

.tituloAdicionar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tituloFiltro {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tituloPagina {
  font-size: 20px;
  font-weight: 700;
}

.botaoAdicionar {
  background-color: #f8a953;
  color: white;
  height: 37px;
  width: 78px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  border: none;
}

.tituloProdutos {
  font-size: 20px;
  font-weight: 700;
}

@media (min-width: 769px) {
  .tituloPagina {
    font-size: 24px;
  }

  .botaoAdicionar {
    width: 100px;
    height: 50px;
    font-size: 16px;
  }
}
</style>