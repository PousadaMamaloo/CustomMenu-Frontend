<template>
    <BaseCard class="cardRefeicoes">
        <div class="cardRefeicoesConteudo">
            <div class="cardRefeicoesTitulo">{{ evento.nome_evento || evento.nome }}</div>

            <div class="cardRefeicoesInfo">
                <i class="mdi mdi-clock-outline"></i>
                <span>{{ horariosFormatados }}</span>
            </div>

            <div class="cardRefeicoesInfo">
                <i class="mdi mdi-account-group"></i>
                <span>{{ evento.publico_alvo ? 'Todos os hóspedes' : 'Quartos específicos' }}</span>
            </div>

            <div class="cardRefeicoesInfo" v-if="evento.recorrencia">
                <i class="mdi mdi-calendar-multiple"></i>
                <span>Evento recorrente</span>
            </div>

            <div class="cardRefeicoesInfo" v-if="quantidadeItens !== null">
                <i class="mdi mdi-food"></i>
                <span>{{ quantidadeItens }} {{ quantidadeItens === 1 ? 'item' : 'itens' }} no cardápio</span>
            </div>

            <div class="cardRefeicoesStatus">
                <span :class="['status', evento.sts_evento ? 'ativo' : 'inativo']">
                    {{ evento.sts_evento ? 'Ativo' : 'Inativo' }}
                </span>
            </div>
        </div>
        <div class="cardRefeicoesBotoes">
            <button class="botaoEditar" @click.stop="$emit('editar', evento.id || evento.id_evento)">
                <i class="mdi mdi-pencil"></i>
                Editar
            </button>
            <button class="botaoCardapio" @click.stop="$emit('cardapio', evento.id || evento.id_evento)">
                <i class="mdi mdi-food-variant"></i>
                Cardápio
            </button>
        </div>
    </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from './BaseCard.vue';

const props = defineProps({
    Refeicao: {
        type: Object,
        required: true,
    }
});

defineEmits(['editar', 'cardapio']);

// Computed property para trabalhar com o evento
const evento = computed(() => props.Refeicao);

// Formatação dos horários
const horariosFormatados = computed(() => {
    const horarios = evento.value.horarios_evento;
    if (!horarios || horarios.length === 0) {
        return 'Sem horário definido';
    }

    // Se for uma string, tenta fazer parse
    if (typeof horarios === 'string') {
        try {
            const parsed = JSON.parse(horarios);
            if (Array.isArray(parsed)) {
                return parsed.join(', ');
            }
            return horarios;
        } catch {
            return horarios;
        }
    }

    // Se for array, junta os horários
    if (Array.isArray(horarios)) {
        return horarios.join(', ');
    }

    return 'Sem horário definido';
});

// Quantidade de itens no cardápio
const quantidadeItens = computed(() => {
    const qtd = evento.value.quantidade_itens;
    if (qtd !== undefined && qtd !== null) {
        return qtd;
    }

    // Fallback: se tiver array de itens, conta eles
    if (evento.value.itens && Array.isArray(evento.value.itens)) {
        return evento.value.itens.length;
    }

    return null;
});
</script>

<style scoped>
.cardRefeicoes {
    display: flex;
    align-items: center;
    border-radius: 16px;
    box-shadow: 0 4px 32px #0000001f;
    flex: 1 1 calc(50% - 8px);
    max-width: 450px;
    background-color: white;
    padding: 16px;
    gap: 18px;
    cursor: pointer;
    transition: box-shadow 0.18s;
    flex-direction: row;
}

.cardRefeicoes:hover {
    box-shadow: 0 6px 38px #00000026;
}

.cardRefeicoesConteudo {
    display: flex;
    flex-direction: column;
    width: 75%;
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

.cardRefeicoesInfo i {
    font-size: 14px;
    color: #f8a953;
}

.descricao {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cardRefeicoesStatus {
    margin-bottom: 4px;
}

.status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
}

.status.ativo {
    background-color: #e8f5e8;
    color: #2e7d32;
}

.status.inativo {
    background-color: #ffebee;
    color: #c62828;
}

.cardRefeicoesBotoes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 25%;
    justify-content: center;
    margin-left: auto;
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
    background-color: #f8a953;
}

.botaoEditar:hover,
.botaoCardapio:hover {
    background-color: #d48833;
}

@media (min-width: 764px) {
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
