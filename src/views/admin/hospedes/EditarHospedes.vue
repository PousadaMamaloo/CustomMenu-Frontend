<template>
    <div class="pagina-container">
        <BotaoVoltar destino="/admin/hospedes" textPage="Editar Hóspede" />

        <Loading v-if="carregando" />


        <form v-else-if="form.id_hospede" @submit.prevent="salvarAlteracoes">
            <div class="formulario">
                <div class="campo-grupo">
                    <label class="tituloInput">Nome do Hóspede</label>
                    <input :value="form.nome_hospede" class="inputDado" type="text" disabled />
                    <p class="hint-info">O nome não pode ser alterado.</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Telefone</label>
                    <input :value="form.telef_hospede" class="inputDado" type="tel" disabled />
                    <p class="hint-info">O telefone não pode ser alterado.</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Chegada</label>
                    <input v-model="form.data_chegada" class="inputDado" type="date" disabled />
                    <p class="hint-info">A data de chegada é fixa.</p>
                </div>
                <div class="campo-grupo">
                    <label class="tituloInput">Data de Saída</label>
                    <input v-model="form.data_saida" class="inputDado" type="date" />
                </div>

                <div class="campo-grupo">
                    <label class="tituloInput">Quarto (atual: Quarto {{ quartoAtual.num_quarto }} (Cap: {{ quartoAtual.capa_adultos + quartoAtual.capa_criancas }}))</label>
                    <select  v-model="form.id_quarto" class="inputDado">
                        <option disabled value="{{quartoAtual.id_quarto}}"> Quarto {{ quartoAtual.num_quarto }} (Cap: {{ quartoAtual.capa_adultos + quartoAtual.capa_criancas }}) </option>
                        <option v-for="quarto in quartosDisponiveis" :key="quarto.id_quarto" :value="quarto.id_quarto"
                            :selected="quarto.id_quarto === form.id_quarto">
                            Quarto {{ quarto.num_quarto }} (Cap: {{ quarto.capa_adultos + quarto.capa_criancas }})
                        </option>
                    </select>
                </div>
            </div>
            <div class="areaBotoes">
                <BotaoSalvar texto="Salvar Alterações" :disabled="carregando" />
                <button type="button" class="botao-checkout" @click="fazerCheckout" :disabled="carregando">
                    Realizar Check-out
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '@/components/botoes/botaoSalvar.vue';
import HospedeService from '@/services/HospedeService';
import QuartoService from '@/services/QuartoService';
import Loading from '@/components/Loading.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const hospedeId = route.params.id;
const carregando = ref(true);
const quartosDisponiveis = ref([]);

const form = ref({
    id_hospede: null,
    nome_hospede: '',
    telef_hospede: '',
    data_chegada: '',
    data_saida: '',
    id_quarto: '',
});

// Função para formatar a data para o input (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};
let quartoAtual;

onMounted(async () => {
    try {
        // Buscar dados do hóspede
        const hospede = await HospedeService.buscarHospedePorId(hospedeId);
        if (hospede) {
            console.log('Dados do hóspede:', hospede);
            form.value.id_hospede = hospede.id_hospede;
            form.value.nome_hospede = hospede.nome_hospede;
            form.value.telef_hospede = hospede.telef_hospede;
            form.value.data_chegada = formatDateForInput(hospede.data_chegada);
            form.value.data_saida = formatDateForInput(hospede.data_saida);

        } else {
            toast.error('Hóspede não encontrado.');
            router.push('/admin/hospedes');
            return;
        }

        // Buscar todos os quartos
        const todosQuartos = await QuartoService.listarQuartos();

        // Incluir quartos livres + o quarto atual do hóspede
        const quartosLivres = todosQuartos.filter(q => q.id_hospede_responsavel === null);

        quartoAtual = todosQuartos.find(q => q.id_hospede_responsavel === hospede.id_hospede);

        quartosDisponiveis.value = [...quartosLivres];
        quartosDisponiveis.value.sort((a, b) => a.num_quarto - b.num_quarto);


    } catch (error) {
        toast.error('Falha ao carregar dados do hóspede.');
        router.push('/admin/hospedes');
    } finally {
        carregando.value = false;
    }
});

async function salvarAlteracoes() {
    carregando.value = true;
    try {
        const payload = {
            data_saida: form.value.data_saida,
            id_quarto: parseInt(form.value.id_quarto),
        };
        await HospedeService.atualizarHospede(hospedeId, payload);
        toast.success('Alterações salvas com sucesso!');
        router.push('/admin/hospedes');
    } catch (error) {
        toast.error('Erro ao salvar as alterações.');
    } finally {
        carregando.value = false;
    }
}

async function fazerCheckout() {
    const result = await Swal.fire({
        title: 'Realizar Check-out',
        text: `Você realmente deseja realizar o check-out de ${form.value.nome_hospede}? O quarto será liberado.`,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD7373',
        confirmButtonText: 'Sim, fazer check-out!',
    });

    if (result.isConfirmed) {
        carregando.value = true;
        try {
            await HospedeService.deletarHospede(hospedeId);
            toast.success('Check-out realizado com sucesso!');
            router.push('/admin/hospedes');
        } catch (error) {
            toast.error('Erro ao realizar o check-out.');
        } finally {
            carregando.value = false;
        }
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

.inputDado:disabled {
    background-color: #f2f2f2;
    cursor: not-allowed;
}

.tituloInput {
    font-size: 14px;
    font-weight: 550;
    margin-bottom: 8px;
}

.hint-info {
    color: #78828A;
    font-size: 12px;
    margin-top: 4px;
}

.areaBotoes {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.botao-checkout {
    background-color: #DD7373;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 16px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.botao-checkout:hover {
    background-color: #c0392b;
}
</style>
