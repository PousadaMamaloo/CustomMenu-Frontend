<template>
    <div class="cardEvento">
        <div class="cardEventoConteudo">
            <div class="cardEventoTitulo">{{ evento.nome }}</div>
            <div class="cardEventoInfo">
                <span>Recorrente: {{ evento.recorrente ? 'Sim' : 'Não' }}</span>
            </div>
            <div class="cardEventoInfo">
                <span>Público: {{ evento.todosHospedes ? 'Todos hóspedes' : 'Específico' }}</span>
            </div>
            <div class="cardEventoInfo">
                <span>Horário: {{ evento.horaInicio }} - {{ evento.horaFim }}</span>
            </div>
            <div v-if="evento.itensCount !== undefined" class="cardEventoInfo">
                <span>Itens no cardápio: {{ evento.itensCount }}</span>
            </div>
        </div>
        <div class="cardEventoBotoes">
            <button class="botaoEditar" @click.stop="$emit('editar', evento.id)">Editar</button>
            <button class="botaoCardapio" @click.stop="$emit('cardapio', evento.id)">Cardápio</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    evento: {
        type: Object,
        required: true,
    }
});
defineEmits(['editar', 'cardapio']);
</script>

<style scoped>
.cardEvento {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px #0000001f;
    width: 100%;
    padding: 16px;
    height: 100px;
    gap: 18px;
    cursor: pointer;
    transition: box-shadow 0.18s;
}

.cardEvento:hover {
    box-shadow: 0 6px 38px #00000026;
}

.cardEventoConteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cardEventoTitulo {
    font-size: 16px;
    font-weight: 600;
    color: #222;
}

.cardEventoInfo {
    font-size: 12px;
    color: #78828a;
    display: flex;
    gap: 8px;
    align-items: center;
}

.cardEventoBotoes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 30%;
    justify-content: center;
}

.botaoEditar,
.botaoCardapio {
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 12px;
    color: white;
}

.botaoEditar,
.botaoCardapio {
    background-color: #f8a953;
}

.botaoEditar:hover,
.botaoCardapio:hover {
    background-color: #d48833;
}

@media (min-width: 764px) {
    .cardEvento {
        width: 420px;
        height: 140px;
        padding: 20px;
    }

    .cardEventoIcone {
        font-size: 70px;
        width: 100px;
    }

    .cardEventoTitulo {
        font-size: 20px;
    }

    .cardEventoInfo {
        font-size: 14px;
    }

    .cardEventoBotoes {
        width: 20%;
    }
}
</style>
