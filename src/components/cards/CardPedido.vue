<template>
    <div class="cardPedido">
        <div class="cardPedidoIcone">
            <span class="mdi mdi-silverware"></span>
        </div>
        <div class="cardPedidoConteudo">
            <div class="cardPedidoTitulo">
                Pedido - Quarto {{ quarto }}
            </div>
            <div class="cardPedidoInfo">
                <span class="mdi mdi-clock-outline infoIcone"></span>
                <span class="infoHora">{{ horario }}</span>
                <span class="mdi mdi-account infoIcone"></span>
                <span class="infoNome">{{ nome }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    quarto: {
        type: [String, Number],
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.cardPedido {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px #0000001f;
    width: 344px;
    height: 60px;
    gap: 18px;
    transition: box-shadow 0.18s;
}

.cardPedidoIcone {
    color: #f8a953;
    font-size: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
}

.cardPedidoConteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.cardPedidoTitulo {
    font-size: 16px;
    font-weight: semibold;
}

.cardPedidoInfo {
    display: flex;
    align-items: center;
    color: #78828a;
    gap: 4px;
}

.infoIcone {
    font-size: 10px;
}

.infoHora,
.infoNome {
    font-size: 8px;
}

@media (min-width: 764px) {
    .cardPedido {
        width: 320px;
        height: 100px;
    }

    .cardPedidoIcone {
        font-size: 70px;
        width: 100px;
    }

    .cardPedidoTitulo {
        font-size: 18px;
        margin-bottom: 15px;
    }

    .cardPedidoInfo {
        gap: 8px;
    }

    .infoIcone,
    .infoHora,
    .infoNome {
        font-size: 16px;
    }
}
</style>
