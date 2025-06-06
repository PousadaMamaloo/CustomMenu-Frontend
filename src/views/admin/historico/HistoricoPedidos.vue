<template>
    <div class="paginaHistoricoPedidos">
        <div class="cabecalhoHistorico">
            <BotaoVoltar destino="/" textPage="Histórico de Pedidos" />
        </div>

        <div class="filtrosHistorico">
            <select v-model="filtroStatus" class="selectFiltro">
                <option value="">Todos os status</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
                <option value="pendente">Pendente</option>
            </select>
        </div>

        <div class="listaHistorico">
            <CardHistoricoPedido 
                v-for="pedido in pedidosFiltrados" 
                :key="pedido.id" 
                :pedido="pedido"
                @verMais="irParaDetalhes"
                @reaproveitar="reaproveitar"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CardHistoricoPedido from '@/components/cards/CardHistoricoPedido.vue'
import BotaoVoltar from '@/components/botoes/BotaoVoltar.vue'

const router = useRouter()
const filtroStatus = ref('')

const pedidosHistorico = ref([
    {
        id: 1,
        quarto: 101,
        data: '15/12/2024 - 08:30',
        totalItens: 5,
        status: 'entregue',
        podeReaproveitar: true
    },
    {
        id: 2,
        quarto: 102,
        data: '14/12/2024 - 19:00',
        totalItens: 3,
        status: 'cancelado',
        podeReaproveitar: false
    }
])

const pedidosFiltrados = computed(() => {
    if (!filtroStatus.value) return pedidosHistorico.value
    return pedidosHistorico.value.filter(p => p.status === filtroStatus.value)
})

function irParaDetalhes(pedidoId) {
    router.push(`/admin/historico-pedidos/${pedidoId}`)
}

function reaproveitar(pedidoId) {
    alert(`Reaproveitando pedido ${pedidoId}`)
}
</script>

<style scoped>
.paginaHistoricoPedidos {
    padding: 20px;
}

.cabecalhoHistorico {
    margin-bottom: 20px;
}

.filtrosHistorico {
    margin-bottom: 20px;
}

.selectFiltro {
    padding: 8px 12px;
    border: 1px solid #dddde3;
    border-radius: 8px;
    font-size: 14px;
}

.listaHistorico {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
