<template>
    <div class="paginaPedidos">
        <div class="cabecalhoPedidos">
            <BotaoVoltar destino="/" textPage="Gerenciar Pedidos" />
            <div class="acoesPedidos">
                <button class="botaoIcone" @click="irParaRelatorio">
                    <span class="mdi mdi-download"></span>
                </button>
                <botaoFiltro ref="filtroBtn" @click="abrirModalFiltro = true" />
            </div>
        </div>

        <!-- ModalFiltroCategorias -->
        <ModalFiltroCategorias v-if="abrirModalFiltro" :aberto="abrirModalFiltro" :categorias="categoriasDisponiveis"
            :selecionadas="categoriasSelecionadas" :anchor="anchorEl"
            @update:selecionadas="categoriasSelecionadas = $event" @close="abrirModalFiltro = false" />

        <ContainerCards :items="pedidosFiltrados">
            <template #default="{ item }">
                <CardPedido :id="item.id" :quarto="item.quarto" :nome="item.nome" :horario="item.horario" />
            </template>
        </ContainerCards>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import CardPedido from '@/components/cards/CardPedido.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ModalFiltroCategorias from '@/components/modal/ModalFiltroCategorias.vue'
import ContainerCards from '@/components/ContainerCards.vue'
import botaoFiltro from '@/components/botoes/botaoFiltro.vue'

const router = useRouter()

const abrirModalFiltro = ref(false)
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

// Atualiza anchorEl sempre que abrirModalFiltro for true
watch(abrirModalFiltro, (aberto) => {
    if (aberto) {
        nextTick(() => {
            anchorEl.value = filtroBtn.value
        })
    }
})

function irParaRelatorio() {
    router.push('/admin/pedidos/relatorio')
}

</script>

<style scoped>
.paginaPedidos {
    padding: 24px 16px 0 16px;
    margin: 0 auto;
    max-width: 900px;
    box-sizing: border-box;
}

.cabecalhoPedidos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
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
    background-color: #f8a953;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.botaoIcone:hover {
    background: #ffa948;
}

@media (min-width: 900px) {
    .paginaPedidos {
        padding-left: 0;
        padding-right: 0;
    }
}
</style>
