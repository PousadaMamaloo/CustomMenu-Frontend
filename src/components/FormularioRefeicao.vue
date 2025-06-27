<template>
    <form @submit.prevent="salvarRefeicao">
        <div class="campo">
            <label for="nomeEvento">Nome do Evento</label>
            <input class="inputNone" id="nomeEvento" type="text" v-model="form.nome_evento" required />
        </div>

        <div class="campo">
            <label for="descEvento">Descrição do Evento</label>
            <textarea id="descEvento" v-model="form.desc_evento" rows="3" placeholder="Descreva o evento..."></textarea>
        </div>

        <div class="campoCheckbox">
            <label class="checkboxContainer" for="recorrente">
                <input class="checkbox" type="checkbox" id="recorrente" v-model="form.recorrencia" />
                <span class="checkboxCustom"></span>
                Evento recorrente todos os dias
            </label>
        </div>

        <div class="campoCheckbox">
            <label class="checkboxContainer" for="publicoAlvo">
                <input class="checkbox" type="checkbox" id="publicoAlvo" v-model="form.publico_alvo" />
                <span class="checkboxCustom"></span>
                Disponível para todos os hóspedes
            </label>
        </div>

        <div class="campoCheckbox">
            <label class="checkboxContainer" for="statusEvento">
                <input class="checkbox" type="checkbox" id="statusEvento" v-model="form.sts_evento" />
                <span class="checkboxCustom"></span>
                Evento ativo
            </label>
        </div>

        <div class="campo">
            <label class="tituloInput">Quartos que podem ver o Evento</label>

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

        <button type="submit" class="botaoSalvar">{{ RefeicaoId ? 'Atualizar' : 'Salvar' }}</button>
    </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import EventoService from '@/services/EventoService'

const listaQuartos = ref([
    { id: 1, nome: 'Quarto 101' },
    { id: 2, nome: 'Quarto 102' },
    { id: 3, nome: 'Quarto 103' },
])

const quartosSelecionados = ref([])
const isLoading = ref(false)
const erro = ref(null)

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
    nome_evento: '',
    desc_evento: '',
    recorrencia: false,
    publico_alvo: false,
    sts_evento: true,
    horaInicio: '',
    horaFim: '',
    quartos: [],
    horarios: [],
    datas: []
})

// Se for edição, buscar dados do evento
onMounted(() => {
    if (props.RefeicaoId) {
        carregarEvento(props.RefeicaoId)
    }
})

watch(() => props.RefeicaoId, (novoId) => {
    if (novoId) {
        carregarEvento(novoId)
    }
})

async function carregarEvento(id) {
    try {
        isLoading.value = true
        erro.value = null

        // DESCOMENTE QUANDO A API ESTIVER PRONTA:
        // const evento = await EventoService.buscarPorId(id)
        // form.value = {
        //     nome_evento: evento.nome_evento,
        //     desc_evento: evento.desc_evento,
        //     recorrencia: evento.recorrencia,
        //     publico_alvo: evento.publico_alvo,
        //     sts_evento: evento.sts_evento,
        //     horaInicio: evento.horarios?.[0]?.hora_inicio || '',
        //     horaFim: evento.horarios?.[0]?.hora_fim || '',
        //     quartos: evento.quartos || [],
        //     horarios: evento.horarios || [],
        //     datas: evento.datas || []
        // }
        // quartosSelecionados.value = evento.quartos?.map(q => q.id) || []
        // isLoading.value = false

        // SIMULAÇÃO TEMPORÁRIA (REMOVER QUANDO API ESTIVER PRONTA):
        setTimeout(() => {
            form.value = {
                nome_evento: 'Café da manhã',
                desc_evento: 'Café da manhã personalizado para cada quarto!',
                recorrencia: true,
                publico_alvo: false,
                sts_evento: true,
                horaInicio: '07:00',
                horaFim: '10:00',
                quartos: [],
                horarios: [],
                datas: []
            }
            quartosSelecionados.value = [1, 2]
            isLoading.value = false
        }, 300)

    } catch (error) {
        console.error('Erro ao carregar evento:', error)
        erro.value = 'Erro ao carregar os dados do evento'
        isLoading.value = false
    }
}

async function salvarRefeicao() {
    try {
        isLoading.value = true
        erro.value = null

        // Preparar dados para envio
        const dadosEvento = {
            nome_evento: form.value.nome_evento,
            desc_evento: form.value.desc_evento,
            recorrencia: form.value.recorrencia,
            publico_alvo: form.value.publico_alvo,
            sts_evento: form.value.sts_evento,
            quartos: quartosSelecionados.value,
            horarios: [{
                hora_inicio: form.value.horaInicio,
                hora_fim: form.value.horaFim
            }],
            datas: form.value.datas || []
        }

        console.log('Salvando evento:', dadosEvento)

        // DESCOMENTE QUANDO A API ESTIVER PRONTA:
        // if (props.RefeicaoId) {
        //     await EventoService.atualizar(props.RefeicaoId, dadosEvento)
        // } else {
        //     await EventoService.criar(dadosEvento)
        // }
        // emit('salvar')
        // isLoading.value = false

        // SIMULAÇÃO TEMPORÁRIA (REMOVER QUANDO API ESTIVER PRONTA):
        setTimeout(() => {
            emit('salvar')
            isLoading.value = false
        }, 500)

    } catch (error) {
        console.error('Erro ao salvar evento:', error)
        erro.value = 'Erro ao salvar o evento'
        isLoading.value = false
    }
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
input[type='time'],
textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid #ddd;
    font-size: 14px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;
}

input[type='text']:focus,
input[type='time']:focus,
textarea:focus {
    border-color: #f8a953;
    outline: none;
    box-shadow: 0 0 8px rgba(248, 169, 83, 0.5);
}

textarea {
    resize: vertical;
    min-height: 80px;
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
