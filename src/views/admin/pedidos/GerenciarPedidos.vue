<template>
    <div class="paginaPedidos">
        <div class="cabecalhoPedidos">
            <BotaoVoltar destino="/admin" textPage="Gerenciar Pedidos" />
            <div class="acoesPedidos">
                <button class="botaoTexto" @click="irParaHistorico">
                    <span class="mdi mdi-history"></span>
                    Histórico
                </button>
                <button class="botaoIcone" @click="irParaComandaGeral" title="Ver Comanda Geral de Itens">
                    <span class="mdi mdi-receipt-text-outline"></span>
                </button>
                <button class="botaoIcone" @click="irParaRelatorio" title="Baixar Relatório">
                    <span class="mdi mdi-download"></span>
                </button>

                <div class="containerOrdenacao">
                    <select v-model="ordemSelecionada" class="seletorOrdenacao">
                        <option value="recentes">Mais Recentes</option>
                        <option value="antigos">Mais Antigos</option>
                    </select>
                </div>
            </div>
        </div>

        <ContainerCards :items="pedidosOrdenados">
            <template #default="{ item }">
                <CardPedido 
                    :id="item.id" 
                    :quarto="item.quarto" 
                    :nome="item.nome" 
                    :horario="item.horario"
                    @click="verDetalhesDoPedido(item.id)"
                    class="card-clicavel"
                />
            </template>
        </ContainerCards>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CardPedido from '@/components/cards/CardPedido.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import ContainerCards from '@/components/ContainerCards.vue'

const router = useRouter()

const ordemSelecionada = ref('recentes');

const pedidos = ref([
    { id: 1, quarto: 1, nome: 'João Paulo', horario: '9:30', horarioPedido: '2025-06-21T09:30:00Z' },
    { id: 2, quarto: 6, nome: 'João Paulo', horario: '10:00', horarioPedido: '2025-06-21T10:00:00Z' },
    { id: 3, quarto: 2, nome: 'João Paulo', horario: '8:00', horarioPedido: '2025-06-21T08:00:00Z' },
    { id: 4, quarto: 9, nome: 'João Paulo', horario: '9:35', horarioPedido: '2025-06-21T09:35:00Z' },
    { id: 5, quarto: 10, nome: 'João Paulo', horario: '9:32', horarioPedido: '2025-06-21T09:32:00Z' },
    { id: 6, quarto: 4, nome: 'João Paulo', horario: '7:30', horarioPedido: '2025-06-21T07:30:00Z' },
    { id: 7, quarto: 1, nome: 'Maria Silva', horario: '10:05', horarioPedido: '2025-06-21T10:05:00Z' },
]);

const pedidosOrdenados = computed(() => {
    const pedidosCopia = [...pedidos.value];
    
    pedidosCopia.sort((a, b) => {
        const dataA = new Date(a.horarioPedido);
        const dataB = new Date(b.horarioPedido);

        if (ordemSelecionada.value === 'recentes') {
            return dataB - dataA;
        } else {
            return dataA - dataB;
        }
    });

    return pedidosCopia;
});

function irParaRelatorio() {
    // router.push('/admin/pedidos/relatorio') - Implementar se necessário
}

function verDetalhesDoPedido(pedidoId) {
    router.push(`/admin/pedidos/${pedidoId}`);
}

function irParaHistorico() {
    router.push('/admin/historico-pedidos');
}

function irParaComandaGeral() {
    router.push('/admin/pedidos/comanda-geral');
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
.acoesPedidos {
    display: flex;
    gap: 10px;
    align-items: center;
}
.botaoIcone {
    background-color: #f8a953;
    border: none;
    padding: 12px;
    border-radius: 8px;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 48px;
    width: 48px;
}
.botaoIcone:hover {
    background: #ffa948;
}
.botaoTexto {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 48px;
}
.botaoTexto:hover {
    background-color: #e0e0e0;
}
.containerOrdenacao {
    border-left: 1px solid #e0e0e0;
    padding-left: 10px;
}
.seletorOrdenacao {
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background-color: #fff;
    font-weight: 600;
    font-size: 14px;
    height: 48px;
}
.card-clicavel {
    cursor: pointer;
}
</style>