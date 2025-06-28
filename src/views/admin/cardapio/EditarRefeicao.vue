<template>
    <div class="pagina-container">
        <BotaoVoltar destino="/admin/refeicao" textPage="Editar Evento" />

        <div v-if="carregando && !form.nome_evento" class="carregando-inicial">
            <p>Carregando dados do evento...</p>
        </div>

        <div v-else>
            <form @submit.prevent="salvarEvento">
                <div class="formulario">
                    <!-- NOME E DESCRIÇÃO -->
                    <div class="campo-grupo">
                        <label class="tituloInput">Nome do Evento</label>
                        <input v-model="form.nome_evento" class="inputDado" type="text"
                            placeholder="Ex: Café da Manhã Especial" required />
                    </div>
                    <div class="campo-grupo">
                        <label class="tituloInput">Descrição</label>
                        <textarea v-model="form.desc_evento" class="inputDado textarea"
                            placeholder="Descreva o evento..."></textarea>
                    </div>

                    <!-- HORÁRIOS DINÂMICOS -->
                    <div class="campo-grupo">
                        <label class="tituloInput">Horários</label>
                        <div v-for="(horario, index) in form.horarios" :key="index" class="campo-dinamico">
                            <input v-model="form.horarios[index]" class="inputDado" type="time" />
                            <button type="button" @click="removerHorario(index)" class="botao-remover">-</button>
                        </div>
                        <button type="button" @click="adicionarHorario" class="botao-adicionar">+ Adicionar
                            Horário</button>
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
                        <label class="tituloInput">Datas do Evento</label>
                        <div v-for="(data, index) in form.datas" :key="index" class="campo-dinamico">
                            <input v-model="form.datas[index]" class="inputDado" type="date" />
                            <button type="button" @click="removerData(index)" class="botao-remover">-</button>
                        </div>
                        <button type="button" @click="adicionarData" class="botao-adicionar">+ Adicionar Data</button>
                    </div>

                    <!-- QUARTOS (CONDICIONAL) -->
                    <div v-if="!form.publico_alvo" class="campo-grupo">
                        <label class="tituloInput">Quartos Específicos</label>
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
                    <button type="button" @click="confirmarExclusao" class="botaoExcluir" :disabled="carregando">
                        Excluir Evento
                    </button>
                    <BotaoSalvar :disabled="carregando" texto="Atualizar" />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue';
import EventoService from '@/services/EventoService';
import QuartoService from '@/services/QuartoService';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const carregando = ref(false);
const todosOsQuartos = ref([]);
const eventoId = route.params.id;

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
        // Verificar se temos um ID válido
        if (!eventoId) {
            toast.error("ID do evento não encontrado");
            router.push('/admin/refeicao');
            return;
        }

        // Carregar lista de quartos
        todosOsQuartos.value = await QuartoService.listarQuartos();

        // Carregar dados do evento para edição
        await carregarEvento();

    } catch (error) {
        toast.error("Falha ao carregar os dados necessários.");
        router.push('/admin/refeicao');
    }
});

async function carregarEvento() {
    try {
        carregando.value = true;

        const evento = await EventoService.buscarPorId(eventoId);
        console.log("Evento carregado:", evento);

        if (evento) {
            form.value = {
                nome_evento: evento.nome_evento || '',
                desc_evento: evento.desc_evento || '',
                horarios: processarHorarios(evento.horarios) || [''],
                sts_evento: evento.sts_evento ?? true,
                recorrencia: evento.recorrencia ?? false,
                publico_alvo: evento.publico_alvo ?? true,
                datas: evento.datas || [],
                quartos: evento.quartos?.map(q => q.num_quarto || q) || []
            };
        } else {
            toast.error('Evento não encontrado');
            router.push('/admin/refeicao');
        }

    } catch (error) {
        toast.error('Erro ao carregar os dados do evento');
        router.push('/admin/refeicao');
    } finally {
        carregando.value = false;
    }
}

const adicionarHorario = () => form.value.horarios.push('');
const removerHorario = (index) => form.value.horarios.splice(index, 1);
const adicionarData = () => form.value.datas.push('');
const removerData = (index) => form.value.datas.splice(index, 1);

// Função para processar horários vindos da API
function processarHorarios(horarios) {
    if (!horarios || !Array.isArray(horarios) || horarios.length === 0) {
        return [''];
    }

    return horarios.map(horario => {
        // Se for um objeto com hora_inicio
        if (typeof horario === 'object' && horario.hora_inicio) {
            return horario.hora_inicio;
        }
        // Se for uma string
        if (typeof horario === 'string') {
            return horario;
        }
        // Fallback
        return '';
    }).filter(h => h); // Remove horários vazios
}

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

        // Estruturar horários no formato HH:MM esperado pela API
        payload.horarios = payload.horarios
            .filter(h => h && h.trim() !== '')
            .map(horario => {
                // Garantir que está no formato HH:MM
                if (typeof horario === 'string' && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario)) {
                    return horario;
                }
                // Se não está no formato correto, tentar converter
                console.warn(`Horário inválido: ${horario}`);
                return null;
            })
            .filter(h => h !== null); // Remove horários inválidos

        // Verificar se temos pelo menos um horário válido
        if (payload.horarios.length === 0) {
            toast.error('É necessário informar pelo menos um horário válido no formato HH:MM');
            return;
        }

        console.log('Payload a ser enviado:', payload);
        console.log('Horários processados:', payload.horarios);

        await EventoService.atualizar(eventoId, payload);
        toast.success("Evento atualizado com sucesso!");
        router.push('/admin/refeicao');

    } catch (error) {
        toast.error("Erro ao atualizar o evento.");
        console.error(error);
    } finally {
        carregando.value = false;
    }
}

function confirmarExclusao() {
    const confirmar = confirm(`Tem certeza que deseja excluir o evento "${form.value.nome_evento}"?\n\nEsta ação não pode ser desfeita.`);

    if (confirmar) {
        excluirEvento();
    }
}

async function excluirEvento() {
    carregando.value = true;
    try {
        await EventoService.excluir(eventoId);
        toast.success("Evento excluído com sucesso!");
        router.push('/admin/refeicao');

    } catch (error) {
        toast.error("Erro ao excluir o evento.");
        console.error(error);
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

.carregando-inicial {
    text-align: center;
    padding: 60px 20px;
    color: #718096;
    font-size: 18px;
    background-color: #f7fafc;
    border-radius: 16px;
    margin: 20px 0;
}

.carregando-inicial p {
    margin: 0;
    font-weight: 500;
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
    gap: 1rem;
    margin-top: 2rem;
}

.botaoExcluir {
    padding: 14px 20px;
    background: linear-gradient(to right, #e74c3c, #c0392b);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.botaoExcluir:hover {
    background: linear-gradient(to right, #c0392b, #a93226);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.botaoExcluir:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.hint-info {
    color: #78828A;
    font-size: 12px;
    margin-top: 4px;
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
