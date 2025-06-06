<template>
    <div class="paginaDetalhePedido">
        <div class="cabecalhoDetalhe">
            <button class="botaoVoltarDetalhe" @click="voltar">
                <span class="mdi mdi-chevron-left"></span>
            </button>
            <h2 class="tituloDetalhe">Detalhes do Pedido #{{ pedidoId }}</h2>
        </div>

        <div class="conteudoDetalhe">
            <div class="boxDetalhe">
                <h3>Informações do Pedido</h3>
                <p>Quarto: 101</p>
                <p>Data: 15/12/2024 - 08:30</p>
                <p>Status: Entregue</p>
            </div>

            <div class="boxDetalhe">
                <h3>Itens do Pedido</h3>
                <ul>
                    <li>Pão Francês - Qtd: 2</li>
                    <li>Café - Qtd: 1</li>
                    <li>Tapioca - Qtd: 1</li>
                </ul>
            </div>

            <button class="botaoReaproveitar" @click="reaproveitar">
                Reaproveitar Pedido
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pedidoId = route.params.id

function voltar() {
    router.push('/admin/historico-pedidos')
}

function reaproveitar() {
    alert(`Reaproveitando pedido ${pedidoId}`)
}
</script>

<style scoped>
.paginaDetalhePedido {
    padding: 20px;
}

.cabecalhoDetalhe {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.botaoVoltarDetalhe {
    border: none;
    background: none;
    font-size: 28px;
    cursor: pointer;
    color: #444;
}

.tituloDetalhe {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.conteudoDetalhe {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.boxDetalhe {
    background: #fff;
    border: 1px solid #dddde3;
    border-radius: 16px;
    padding: 20px;
}

.botaoReaproveitar {
    background-color: #f8a953;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}
</style>
