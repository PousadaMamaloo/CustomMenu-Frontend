<template>
    <div class="cardHistoricoPedido">
        <div class="cardHistoricoIcone">
            <span class="mdi mdi-silverware"></span>
        </div>
        <div class="cardHistoricoConteudo">
            <div class="cardHistoricoTitulo">
                Pedido - Quarto {{ pedido.quarto }}
            </div>
            <div class="cardHistoricoInfo">
                <span class="mdi mdi-clock-outline infoIcone"></span>
                <span class="infoData">{{ pedido.data }}</span>
                <span class="mdi mdi-silverware infoIcone"></span>
                <span class="infoItens">{{ pedido.totalItens }} itens</span>
            </div>
            <div class="cardHistoricoStatus">
                <span class="statusBadge" :class="pedido.status">{{ getStatusText(pedido.status) }}</span>
            </div>
        </div>
        <div class="cardHistoricoAcoes">
            <button class="botaoVerMais" @click="$emit('verMais', pedido.id)">
                Ver mais
            </button>
            <button 
                class="botaoReaproveitar" 
                :class="{ desabilitado: !pedido.podeReaproveitar }"
                :disabled="!pedido.podeReaproveitar"
                @click="$emit('reaproveitar', pedido.id)"
            >
                {{ pedido.podeReaproveitar ? 'Reaproveitar' : 'Indisponível' }}
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    pedido: {
        type: Object,
        required: true
    }
})

defineEmits(['verMais', 'reaproveitar'])

function getStatusText(status) {
    const statusMap = {
        'entregue': 'Entregue',
        'cancelado': 'Cancelado',
        'pendente': 'Pendente'
    }
    return statusMap[status] || status
}
</script>

<style scoped>
.cardHistoricoPedido {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px #0000001f;
    width: 100%;
    padding: 16px;
    gap: 18px;
    transition: box-shadow 0.18s;
    margin-bottom: 16px;
}

.cardHistoricoPedido:hover {
    box-shadow: 0 6px 38px #00000026;
}

.cardHistoricoIcone {
    color: #f8a953;
    font-size: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
}

.cardHistoricoConteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.cardHistoricoTitulo {
    font-size: 16px;
    font-weight: 600;
    color: #222;
}

.cardHistoricoInfo {
    display: flex;
    align-items: center;
    color: #78828a;
    gap: 8px;
    flex-wrap: wrap;
}

.infoIcone {
    font-size: 12px;
}

.infoData,
.infoItens {
    font-size: 12px;
}

.cardHistoricoStatus {
    margin-top: 4px;
}

.statusBadge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
}

.statusBadge.entregue {
    background: #e8f5e8;
    color: #2d7d32;
}

.statusBadge.cancelado {
    background: #ffebee;
    color: #c62828;
}

.statusBadge.pendente {
    background: #fff3e0;
    color: #ef6c00;
}

.cardHistoricoAcoes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 100px;
}

.botaoVerMais,
.botaoReaproveitar {
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
}

.botaoVerMais {
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
}

.botaoVerMais:hover {
    background-color: #e9ecef;
}

.botaoReaproveitar {
    background-color: #f8a953;
    color: white;
}

.botaoReaproveitar:hover:not(.desabilitado) {
    background-color: #d48833;
}

.botaoReaproveitar.desabilitado {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
}

@media (min-width: 768px) {
    .cardHistoricoPedido {
        padding: 20px;
    }

    .cardHistoricoIcone {
        font-size: 50px;
        width: 80px;
    }

    .cardHistoricoTitulo {
        font-size: 18px;
    }

    .cardHistoricoInfo {
        gap: 12px;
    }

    .infoIcone,
    .infoData,
    .infoItens {
        font-size: 14px;
    }

    .statusBadge {
        font-size: 12px;
        padding: 6px 12px;
    }

    .cardHistoricoAcoes {
        min-width: 120px;
    }

    .botaoVerMais,
    .botaoReaproveitar {
        font-size: 14px;
        padding: 10px 16px;
    }
}
</style>
