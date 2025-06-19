<template>
  <div class="containerFiltro">
    <botaoFiltro ref="filtroBtn" @click="abrirModalFiltro = true" />

    <ModalFiltroCategorias
      v-if="abrirModalFiltro"
      :aberto="abrirModalFiltro"
      :categorias="categoriasDisponiveis"
      :selecionadas="categoriasSelecionadas"
      :anchor="anchorEl"
      @update:selecionadas="categoriasSelecionadas = $event"
      @close="abrirModalFiltro = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
// Ele importa os componentes que precisa usar
import botaoFiltro from '@/components/botoes/botaoFiltro.vue' 
import ModalFiltroCategorias from '@/components/modal/ModalFiltroCategorias.vue'

// O resto do script com a lógica de props, emits e computed properties...
const props = defineProps({
  produtos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:produtosFiltrados'])

const abrirModalFiltro = ref(false)
const categoriasSelecionadas = ref([])
const filtroBtn = ref(null)

const anchorEl = computed(() => filtroBtn.value?.$el ?? filtroBtn.value)

const categoriasDisponiveis = computed(() => {
  return [...new Set(props.produtos.map(p => p.categoria))]
})

const produtosFiltrados = computed(() => {
  if (!categoriasSelecionadas.value.length) return props.produtos
  return props.produtos.filter(p => categoriasSelecionadas.value.includes(p.categoria))
})

const produtosPorCategoria = computed(() => {
  return produtosFiltrados.value.reduce((acc, produto) => {
    if (!acc[produto.categoria]) acc[produto.categoria] = []
    acc[produto.categoria].push(produto)
    return acc
  }, {})
})

watchEffect(() => {
  emit('update:produtosFiltrados', produtosPorCategoria.value)
})
</script>

<style scoped>
.containerFiltro {
  display: flex;
}
</style>