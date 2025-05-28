<template>
    <div class="paginaPedidos">
        <div class="cabecalhoPedidos">
            <h2 class="tituloPedidos">Gerenciar Pedidos</h2>
            <div class="acoesPedidos">
                <button class="botaoIcone">
                    <span class="mdi mdi-download"></span>
                </button>
                <button class="botaoIcone" ref="filtroBtn" @click="abrirFiltro = true">
                    <span class="mdi mdi-tune-variant"></span>
                </button>
            </div>
        </div>

        <!-- ModalFiltroCategorias -->
        <ModalFiltroCategorias v-if="abrirFiltro" :aberto="abrirFiltro" :categorias="categoriasDisponiveis"
            :selecionadas="categoriasSelecionadas" :anchor="anchorEl"
            @update:selecionadas="categoriasSelecionadas = $event" @close="abrirFiltro = false" />

        <div class="listaPedidos">
            <CardPedido v-for="pedido in pedidosFiltrados" :key="pedido.id" :id="pedido.id" :quarto="pedido.quarto"
                :nome="pedido.nome" :horario="pedido.horario" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import CardPedido from '../../../components/cards/CardPedido.vue'
import ModalFiltroCategorias from '../../../components/modal/ModalFiltroCategorias.vue'

const abrirFiltro = ref(false)
const filtroBtn = ref(null)
const anchorEl = ref(null)
const categoriasSelecionadas = ref([])

const pedidos = ref([
    { id: 1, quarto: 1, nome: 'João Paulo', horario: '9:30', categoria: 'Padaria' },
    { id: 2, quarto: 6, nome: 'João Paulo', horario: '10:00', categoria: 'Bebidas' },
    { id: 3, quarto: 2, nome: 'João Paulo', horario: '8:00', categoria: 'Padaria' },
    { id: 4, quarto: 9, nome: 'João Paulo', horario: '9:30', categoria: 'Pratos Quentes' },
    { id: 5, quarto: 10, nome: 'João Paulo', horario: '9:30', categoria: 'Bebidas' },
    { id: 6, quarto: 4, nome: 'João Paulo', horario: '9:30', categoria: 'Frutas' }
])

const categoriasDisponiveis = computed(() => {
    return [...new Set(pedidos.value.map(p => p.categoria))]
})

const pedidosFiltrados = computed(() => {
    if (!categoriasSelecionadas.value.length) return pedidos.value
    return pedidos.value.filter(p => categoriasSelecionadas.value.includes(p.categoria))
})

// Atualiza anchorEl sempre que abrirFiltro for true
watch(abrirFiltro, (aberto) => {
    if (aberto) {
        nextTick(() => {
            anchorEl.value = filtroBtn.value
        })
    }
})
</script>

<style scoped>
.paginaPedidos {
    padding: 40px 0 0 0;
    max-width: 540px;
    margin: 0 auto;
}

.cabecalhoPedidos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 32px;
}

.tituloPedidos {
    font-size: 26px;
    font-weight: 700;
    color: #222;
}

.acoesPedidos {
    display: flex;
    gap: 10px;
}

.botaoIcone {
    background: #f8a953;
    border: none;
    border-radius: 12px;
    width: 48px;
    height: 48px;
    color: white;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    cursor: pointer;
}

.botaoIcone:hover {
    background: #ffa948;
}

.listaPedidos {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
}

@media (min-width: 765px) {
    .paginaPedidos {
        display: flex;
        flex-direction: column;
        max-width: 80%;
    }

    .cabecalhoPedidos {
        display: flex;
        justify-content: space-between;
        padding-inline: 0px;
    }

    .tituloPedidos {
        font-size: 28px;
    }

    .listaPedidos {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>
