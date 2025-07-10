<template>
    <div class="pagina-container">
        <BotaoVoltar destino="/admin/hospedes" textPage="Check-in de Hóspede" />

        <form @submit.prevent="fazerCheckin">
            <div class="formulario">
                <div class="campo-grupo">
                    <label class="tituloInput">Nome do Hóspede<span class="obrigatorio">*</span></label>
                    <input v-model="form.nome_hospede" class="inputDado" type="text" placeholder="Nome completo" />
                    <p v-if="erros.nome_hospede" class="hintErroInput">{{ erros.nome_hospede }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Telefone<span class="obrigatorio">*</span></label>
                    <input v-model="form.telef_hospede" class="inputDado" type="tel" placeholder="(99) 99999-9999" />
                    <p v-if="erros.telef_hospede" class="hintErroInput">{{ erros.telef_hospede }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">E-mail</label>
                    <input v-model="form.email_hospede" class="inputDado" type="email"
                        placeholder="email@exemplo.com" />
                    <p v-if="erros.email_hospede" class="hintErroInput">{{ erros.email_hospede }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Chegada<span class="obrigatorio">*</span></label>
                    <input v-model="form.data_chegada" class="inputDado" type="date" />
                    <p v-if="erros.data_chegada" class="hintErroInput">{{ erros.data_chegada }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Saída</label>
                    <input v-model="form.data_saida" class="inputDado" type="date" :min="minDataSaida" />
                    <p v-if="erros.data_saida" class="hintErroInput">{{ erros.data_saida }}</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Selecionar Quarto<span class="obrigatorio">*</span></label>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue';
import HospedeService from '@/services/HospedeService';
import QuartoService from '@/services/QuartoService';

/**
 * View para o check-in (cadastro) de novos hóspedes.
 * O formulário permite inserir os dados do hóspede, como nome, telefone,
 * datas de chegada e saída, e associá-lo a um quarto vago.
 */

const router = useRouter();
const toast = useToast();
const carregando = ref(false);
const quartosLivres = ref([]);
const erros = ref({});

// Função para obter a data de hoje no formato YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

const form = ref({
    nome_hospede: '',
    email_hospede: '',
    telef_hospede: '',
    data_chegada: getTodayDate(),
    data_saida: '',
    id_quarto: ''
});

watch(() => form.value.data_chegada, (newChegada) => {
    if (form.value.data_saida && new Date(form.value.data_saida) <= new Date(newChegada)) {
        form.value.data_saida = '';
        toast.info('A data de saída foi redefinida por ser inválida com a nova data de chegada.');
    }
});

const minDataSaida = computed(() => {
    if (!form.value.data_chegada) return '';
    const chegada = new Date(form.value.data_chegada);
    chegada.setDate(chegada.getDate() + 1); // Adiciona 1 dia para ser o dia seguinte
    return chegada.toISOString().split('T')[0];
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
    // Validação de e-mail opcional: só valida o formato se algo for digitado
    if (form.value.email_hospede.trim() && !/\S+@\S+\.\S+/.test(form.value.email_hospede)) {
        erros.value.email_hospede = 'Por favor, insira um e-mail válido.';
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
    // Validação de data de saída opcional: só valida se a data de saída for preenchida
    if (form.value.data_saida && new Date(form.value.data_saida) <= new Date(form.value.data_chegada)) {
        erros.value.data_saida = 'A data de saída deve ser posterior à data de chegada.';
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

.obrigatorio {
    color: #DC363C;
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