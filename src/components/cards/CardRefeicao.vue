<template>
    <div class="cardRefeicoes">
        <div class="cardRefeicoesConteudo">
            <div class="cardRefeicoesTitulo">{{ Refeicao.nome }}</div>
            <div class="cardRefeicoesInfo">
                <span>Recorrente: {{ Refeicao.recorrente ? 'Sim' : 'Não' }}</span>
            </div>
            <div class="cardRefeicoesInfo">
                <span>Público: {{ Refeicao.todosHospedes ? 'Todos hóspedes' : 'Específico' }}</span>
            </div>
            <div class="cardRefeicoesInfo">
                <span>Horário: {{ Refeicao.horaInicio }} - {{ Refeicao.horaFim }}</span>
            </div>
            <div v-if="Refeicao.itensCount !== undefined" class="cardRefeicoesInfo">
                <span>Itens no cardápio: {{ Refeicao.itensCount }}</span>
            </div>
        </div>
        <div class="cardRefeicoesBotoes">
            <button class="botaoEditar" @click.stop="$emit('editar', Refeicao.id)">Editar</button>
            <button class="botaoCardapio" @click.stop="$emit('cardapio', Refeicao.id)">Cardápio</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    Refeicao: {
        type: Object,
        required: true,
    }
});
defineEmits(['editar', 'cardapio']);
</script>

<style scoped>
.cardRefeicoes {
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

.cardRefeicoes:hover {
    box-shadow: 0 6px 38px #00000026;
}

.cardRefeicoesConteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cardRefeicoesTitulo {
    font-size: 16px;
    font-weight: 600;
    color: #222;
}

.cardRefeicoesInfo {
    font-size: 12px;
    color: #78828a;
    display: flex;
    gap: 8px;
    align-items: center;
}

.cardRefeicoesBotoes {
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
    .cardRefeicoes {
        width: 420px;
        height: 140px;
        padding: 20px;
    }

    .cardRefeicoesIcone {
        font-size: 70px;
        width: 100px;
    }

    .cardRefeicoesTitulo {
        font-size: 20px;
    }

    .cardRefeicoesInfo {
        font-size: 14px;
    }

    .cardRefeicoesBotoes {
        width: 20%;
    }
}
</style>
