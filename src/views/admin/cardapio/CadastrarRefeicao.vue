<template>
    <div class="pagina-container">
        <BotaoVoltar destino="/admin/refeicao" textPage="Cadastrar Evento" />

        <form @submit.prevent="salvarEvento">
            <div class="formulario">
                <!-- NOME E DESCRIÇÃO -->
                <div class="campo-grupo">
                    <label class="tituloInput">Nome do Evento<span class="obrigatorio">*</span></label>
                    <input v-model="form.nome_evento" class="inputDado" type="text"
                        placeholder="Ex: Café da Manhã Especial" />
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Descrição<span class="obrigatorio">*</span></label>
                    <textarea v-model="form.desc_evento" class="inputDado textarea"
                        placeholder="Descreva o evento..."></textarea>
                </div>

                <!-- HORÁRIOS DINÂMICOS -->
                <div class="campo-grupo">
                    <label class="tituloInput">Horários<span class="obrigatorio">*</span></label>
                    <div v-for="(index) in form.horarios" :key="index" class="campo-dinamico">
                        <input v-model="form.horarios[index]" class="inputDado" type="time" />
                        <button type="button" @click="removerHorario(index)" class="botao-remover">-</button>
                    </div>
                    <button type="button" @click="adicionarHorario" class="botao-adicionar">+ Adicionar Horário</button>
                </div>

                <!-- TOGGLES DE CONFIGURAÇÃO -->
                <div class="linha-toggles">
                    <div class="toggle-grupo">
                        <label>Evento Ativo</label>
                        <div class="toggle-switch" :class="{ ativo: form.sts_evento }"
                            @click="form.sts_evento = !form.sts_evento">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                    <div class="toggle-grupo">
                        <label>Recorrente (Várias Datas)</label>
                        <div class="toggle-switch" :class="{ ativo: form.recorrencia }"
                            @click="form.recorrencia = !form.recorrencia">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                    <div class="toggle-grupo">
                        <label>Para Todos os Hóspedes</label>
                        <div class="toggle-switch" :class="{ ativo: form.publico_alvo }"
                            @click="form.publico_alvo = !form.publico_alvo">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                </div>

                <!-- DATAS (CONDICIONAL) -->
                <div v-if="form.recorrencia" class="campo-grupo">
                    <label class="tituloInput">Datas do Evento<span class="obrigatorio">*</span></label>
                    <div v-for="(data, index) in form.datas" :key="index" class="campo-dinamico">
                        <input v-model="form.datas[index]" class="inputDado" type="date" />
                        <button type="button" @click="removerData(index)" class="botao-remover">-</button>
                    </div>
                    <button type="button" @click="adicionarData" class="botao-adicionar">+ Adicionar Data</button>
                </div>

                <!-- QUARTOS (CONDICIONAL) -->
                <div v-if="!form.publico_alvo" class="campo-grupo">
                    <label class="tituloInput">Quartos Específicos<span class="obrigatorio">*</span></label>
                    <div class="checkbox-container">
                        <!-- "Selecionar Todos" Checkbox -->
                        <div class="checkbox-item master-checkbox">
                            <input type="checkbox" id="selecionar-todos" :checked="todosSelecionados"
                                @change="selecionarTodos" />
                            <label for="selecionar-todos">Selecionar Todos</label>
                        </div>
                        <!-- Lista de Quartos -->
                        <div v-for="quarto in todosOsQuartos" :key="quarto.id_quarto" class="checkbox-item">
                            <input type="checkbox" :id="'quarto-' + quarto.id_quarto" :value="quarto.num_quarto"
                                v-model="form.quartos" />
                            <label :for="'quarto-' + quarto.id_quarto">Quarto {{ quarto.num_quarto }}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="areaBotoes">
                <BotaoSalvar :disabled="carregando" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue';
import CardapioService from '@/services/CardapioService';
import QuartoService from '@/services/QuartoService';

/**
 * View para o cadastro de novos eventos (refeições).
 * Permite ao administrador configurar nome, descrição, horários, status,
 * recorrência e público-alvo (todos os hóspedes ou quartos específicos).
 */

const router = useRouter();
const toast = useToast();
const carregando = ref(false);
const todosOsQuartos = ref([]);

const form = ref({
    nome_evento: '',
    desc_evento: '',
    horarios: [''],
    sts_evento: true,
    recorrencia: false,
    publico_alvo: true,
    datas: [],
    quartos: []
});

onMounted(async () => {
    try {
        todosOsQuartos.value = await QuartoService.listarQuartos();
    } catch (error) {
        toast.error("Falha ao carregar a lista de quartos.");
    }
});

const adicionarHorario = () => form.value.horarios.push('');
const removerHorario = (index) => form.value.horarios.splice(index, 1);
const adicionarData = () => form.value.datas.push('');
const removerData = (index) => form.value.datas.splice(index, 1);

// Lógica para o checkbox "Selecionar Todos"
const todosSelecionados = computed(() => {
    return todosOsQuartos.value.length > 0 && form.value.quartos.length === todosOsQuartos.value.length;
});

function selecionarTodos(event) {
    if (event.target.checked) {
        form.value.quartos = todosOsQuartos.value.map(q => q.num_quarto);
    } else {
        form.value.quartos = [];
    }
}

async function salvarEvento() {
    carregando.value = true;
    try {
        const payload = { ...form.value };

        // Se não for recorrente, define a data para o dia seguinte
        if (!payload.recorrencia) {
            const amanha = new Date();
            amanha.setDate(amanha.getDate() + 1);
            payload.datas = [amanha.toISOString().split('T')[0]];
        }

        // Se for para todos, a API pode esperar um array vazio ou não, ajuste conforme necessário
        if (payload.publico_alvo) {
            payload.quartos = []; // Envia vazio se for para todos
        }

        await CardapioService.criarEvento(payload);
        toast.success("Evento criado com sucesso!");
        router.push('/admin/refeicao');
    } catch (error) {
        toast.error("Erro ao criar o evento.");
    } finally {
        carregando.value = false;
    }
}
</script>

<style scoped>
.pagina-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.formulario {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    margin: 2rem auto;
}

.campo-grupo {
    display: flex;
    flex-direction: column;
}

.inputDado {
    border: 1px solid #DDDDE3;
    border-radius: 16px;
    height: 40px;
    padding: 0 15px;
    font-size: 1rem;
}

.textarea {
    height: 100px;
    padding-top: 10px;
    resize: vertical;
}

.tituloInput {
    font-size: 14px;
    font-weight: 550;
    margin-bottom: 8px;
}

.areaBotoes {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.hint-info {
    color: #78828A;
    font-size: 12px;
    margin-top: 4px;
}

.obrigatorio {
    color: #DC363C;
}

.campo-dinamico {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.campo-dinamico .inputDado {
    flex-grow: 1;
}

.botao-remover,
.botao-adicionar {
    border: none;
    background-color: #ffa948;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.botao-remover {
    background-color: #fdecec;
    color: #e24c3f;
    width: 40px;
    height: 40px;
}

.botao-adicionar {
    background-color: #fff5e6;
    /* Laranja claro */
    color: #ffa948;
    /* Laranja principal */
    padding: 10px;
    width: 100%;
    margin-top: 0.5rem;
}

.linha-toggles {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 16px;
}

.toggle-grupo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #555;
}

.toggle-switch {
    width: 50px;
    height: 28px;
    background-color: #ccc;
    border-radius: 14px;
    padding: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.toggle-switch.ativo {
    background-color: #2ecc71;
}

.toggle-knob {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
}

.toggle-switch.ativo .toggle-knob {
    transform: translateX(22px);
}

.checkbox-container {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #DDDDE3;
    border-radius: 16px;
    padding: 10px;
    background-color: #fff;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
}

.checkbox-item:hover {
    background-color: #f9f9f9;
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.checkbox-item label {
    cursor: pointer;
    font-size: 1rem;
}

.master-checkbox {
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
    font-weight: bold;
}
</style>