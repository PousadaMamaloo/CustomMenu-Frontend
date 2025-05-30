<template>
    <form @submit.prevent="salvarRefeicao">
        <div class="campo">
            <label for="nomeRefeicao">Nome do Refeicao</label>
            <input class="inputNone" id="nomeRefeicao" type="text" v-model="form.nome" required />
        </div>

        <div class="campoCheckbox">
            <label class="checkboxContainer" for="recorrente">
                <input class="checkbox" type="checkbox" id="recorrente" v-model="form.RefeicaoRecorrente" />
                <span class="checkboxCustom"></span>
                Refeicao recorrente todos os dias
            </label>
        </div>

        <div class="campo">
            <label class="tituloInput">Quartos que podem ver o Refeicao</label>

            <label class="checkboxContainer">
                <input type="checkbox" :checked="todosSelecionados" @change="toggleSelecionarTodos" />
                <span class="checkboxCustom"></span>
                Selecionar todos
            </label>

            <div class="listaCheckboxes">
                <label v-for="quarto in listaQuartos" :key="quarto.id" class="checkboxContainer">
                    <input type="checkbox" :value="quarto.id" v-model="quartosSelecionados" />
                    <span class="checkboxCustom"></span>
                    {{ quarto.nome }}
                </label>
            </div>
        </div>

        <div class="campo">
            <label>Horário de Início</label>
            <input type="time" v-model="form.horaInicio" required />
        </div>

        <div class="campo">
            <label>Horário de Fim</label>
            <input type="time" v-model="form.horaFim" required />
        </div>

        <button type="submit" class="botaoSalvar">Salvar</button>
    </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const listaQuartos = ref([
    { id: 1, nome: 'Quarto 101' },
    { id: 2, nome: 'Quarto 102' },
    { id: 3, nome: 'Quarto 103' },
])

const quartosSelecionados = ref([])

const todosSelecionados = computed(() =>
    listaQuartos.value.length > 0 &&
    quartosSelecionados.value.length === listaQuartos.value.length
)

function toggleSelecionarTodos(event) {
    if (event.target.checked) {
        quartosSelecionados.value = listaQuartos.value.map(q => q.id)
    } else {
        quartosSelecionados.value = []
    }
}

const props = defineProps({
    RefeicaoId: {
        type: [String, Number],
        default: null
    }
})

const emit = defineEmits(['salvar'])

const form = ref({
    nome: '',
    recorrente: false,
    todosHospedes: false,
    horaInicio: '',
    horaFim: ''
})

// Se for edição, buscar dados do Refeicao
onMounted(() => {
    if (props.RefeicaoId) {
        carregarRefeicao(props.RefeicaoId)
    }
})

watch(() => props.RefeicaoId, (novoId) => {
    if (novoId) {
        carregarRefeicao(novoId)
    }
})

function carregarRefeicao(id) {
    setTimeout(() => {
        form.value = {
            nome: 'Café da manhã',
            recorrente: true,
            todosHospedes: true,
            horaInicio: '07:00',
            horaFim: '10:00'
        }
    }, 300)
}

function salvarRefeicao() {
    console.log('Salvando Refeicao', form.value)
    emit('salvar')
}
</script>

<style scoped>
form {
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 16px;
    background-color: #fff;
    border-radius: 16px;
    color: #222;
    width: 100%;
    /* Garante que o formulário ocupe 100% da largura disponível */
}

.campo {
    margin-bottom: 24px;
}

label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 15px;
    color: #3a3a3a;
}

input[type='text'],
input[type='time'] {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid #ddd;
    font-size: 14px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

input[type='text']:focus,
input[type='time']:focus {
    border-color: #f8a953;
    outline: none;
    box-shadow: 0 0 8px rgba(248, 169, 83, 0.5);
}

.checkboxContainer {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    gap: 8px;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
}

input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
}

.checkboxCustom {
    width: 22px;
    height: 22px;
    border: 2.5px solid #f8a953;
    border-radius: 50%;
    background: white;
    position: relative;
    transition: background-color 0.3s, border-color 0.3s;
}

input[type="checkbox"]:checked+.checkboxCustom {
    background-color: #f8a953;
    border-color: #f8a953;
}

.checkboxCustom::after {
    content: '';
    position: absolute;
    display: none;
    top: 5px;
    left: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
}

input[type="checkbox"]:checked+.checkboxCustom::after {
    display: block;
}

.listaCheckboxes {
    max-height: 140px;
    overflow-y: auto;
    padding-left: 24px;
}

.campoCheckbox {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-weight: 600;
    font-size: 14px;
    color: #444;
    cursor: pointer;
}

.campoCheckbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #f8a953;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.botaoSalvar {
    width: 100%;
    background-color: #f8a953;
    border: none;
    padding: 14px 0;
    border-radius: 28px;
    color: white;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 6px 12px rgba(248, 169, 83, 0.5);
}

.botaoSalvar:hover {
    background-color: #d48833;
    box-shadow: 0 8px 18px rgba(212, 136, 51, 0.7);
}

@media (min-width: 768px) {
    form {
        width: 80%;
        padding: 32px 40px;
    }

    .campo {
        margin-bottom: 30px;
    }

    .checkboxContainer {
        font-size: 16px;
        gap: 12px;
    }

    .checkboxCustom {
        width: 26px;
        height: 26px;
    }

    .botaoSalvar {
        padding: 16px 0;
        font-size: 18px;
    }
}

@media (min-width: 1224px) {
    form {
        width: 60%;
    }

    .campo {
        margin-bottom: 36px;
    }

    .botaoSalvar {
        padding: 18px 0;
        font-size: 20px;
    }
}
</style>
