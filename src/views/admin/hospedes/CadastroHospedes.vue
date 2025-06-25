<template>
    <div class="pagina-container">
        <BotaoVoltar destino="/admin/hospedes" textPage="Check-in de Hóspede" />

        <form @submit.prevent="fazerCheckin">
            <div class="formulario">
                <div class="campo-grupo">
                    <label class="tituloInput">Nome do Hóspede</label>
                    <input v-model="form.nome_hospede" class="inputDado" type="text" placeholder="Nome completo" />
                    <p v-if="erros.nome_hospede" class="hintErroInput">{{ erros.nome_hospede }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Telefone</label>
                    <input v-model="form.telef_hospede" class="inputDado" type="tel" placeholder="(99) 99999-9999" />
                    <p v-if="erros.telef_hospede" class="hintErroInput">{{ erros.telef_hospede }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Chegada</label>
                    <input v-model="form.data_chegada" class="inputDado" type="date" />
                    <p v-if="erros.data_chegada" class="hintErroInput">{{ erros.data_chegada }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Saída</label>
                    <input v-model="form.data_saida" class="inputDado" type="date" />
                    <p v-if="erros.data_saida" class="hintErroInput">{{ erros.data_saida }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Selecionar Quarto</label>
                    <select v-model="form.id_quarto" class="inputDado">
                        <option disabled value="">Selecione um quarto livre</option>
                        <option v-for="quarto in quartosLivres" :key="quarto.id_quarto" :value="quarto.id_quarto">
                            Quarto {{ quarto.num_quarto }} (Cap: {{ quarto.capa_adultos + quarto.capa_criancas }})
                        </option>
                    </select>
                    <p v-if="erros.id_quarto" class="hintErroInput">{{ erros.id_quarto }}</p>
                </div>
            </div>
            <div class="areaBotoes">
                <BotaoSalvar texto="Fazer Check-in" :disabled="carregando" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue';
import HospedeService from '@/services/HospedeService';
import QuartoService from '@/services/QuartoService';

const router = useRouter();
const toast = useToast();
const carregando = ref(false);
const quartosLivres = ref([]);
const erros = ref({});

// Função para obter a data de hoje no formato YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

const form = ref({
    nome_hospede: '',
    telef_hospede: '',
    data_chegada: getTodayDate(),
    data_saida: '',
    id_quarto: ''
});

onMounted(async () => {
    try {
        const todosQuartos = await QuartoService.listarQuartos();
        quartosLivres.value = todosQuartos.filter(q => q.id_hospede_responsavel === null);
    } catch (error) {
        toast.error("Falha ao carregar a lista de quartos disponíveis.");
    }
});

function validarCampos() {
    erros.value = {};
    let valido = true;

    if (!form.value.nome_hospede.trim()) {
        erros.value.nome_hospede = 'O nome do hóspede é obrigatório.';
        valido = false;
    }
    if (!form.value.telef_hospede.trim()) {
        erros.value.telef_hospede = 'O telefone é obrigatório.';
        valido = false;
    }
    if (!form.value.id_quarto) {
        erros.value.id_quarto = 'É obrigatório selecionar um quarto.';
        valido = false;
    }
    if (!form.value.data_chegada) {
        erros.value.data_chegada = 'A data de chegada é obrigatória.';
        valido = false;
    }
    if (!form.value.data_saida) {
        erros.value.data_saida = 'A data de saída é obrigatória.';
        valido = false;
    } else if (new Date(form.value.data_saida) < new Date(form.value.data_chegada)) {
        erros.value.data_saida = 'A data de saída não pode ser anterior à data de chegada.';
        valido = false;
    }

    return valido;
}

async function fazerCheckin() {
    if (!validarCampos()) {
        toast.warning('Por favor, corrija os erros no formulário.');
        return;
    }

    carregando.value = true;
    try {
        await HospedeService.cadastrarHospede(form.value);
        toast.success("Check-in realizado com sucesso!");
        router.push('/admin/hospedes');
    } catch (error) {
        toast.error("Erro ao realizar o check-in.");
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
    gap: 1rem;
    max-width: 400px;
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

.tituloInput {
    font-size: 14px;
    font-weight: 550;
    margin-bottom: 8px;
}

.hintErroInput {
    color: #DC363C;
    font-size: 12px;
    margin-top: 4px;
}

.areaBotoes {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}
</style>