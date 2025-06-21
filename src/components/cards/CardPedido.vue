<template>
    <BaseCard class="cardPedido" @click="irParaRelatorio">
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
    </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from './BaseCard.vue'

const props = defineProps({
    id: [String, Number],
    quarto: [String, Number],
    nome: String,
    horario: String
})

const router = useRouter()

function irParaDetalhes() { 
  router.push({ name: 'AdminDetalhesPedido', params: { id: props.id } });
}
</script>

<style scoped>
.cardPedido,
.baseCard,
.BaseCard {
    display: flex;
    align-items: center;
    flex: 1 1 350px;
    max-width: 400px;
    min-width: 350px;
    box-sizing: border-box;
    margin-bottom: 0;
    gap: 18px;
    cursor: pointer;
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
    font-weight: 600;
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

@media (max-width: 800px) {

    .cardPedido,
    .baseCard,
    .BaseCard {
        flex-basis: 100%;
        max-width: 100%;
        min-width: 0;
    }

    .cardPedidoIcone {
        font-size: 32px;
        width: 50px;
    }
}

@media (min-width: 764px) {

    .cardPedido,
    .baseCard,
    .BaseCard {
        width: auto;
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