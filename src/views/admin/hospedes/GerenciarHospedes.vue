<template>
    <div class="containerPagina">
        <div class="cabecalho">
            <BotaoVoltar destino="/admin" textPage="Gerenciar Hóspedes" />
            <div class="acoes">
                <BotaoAdicionar @click="irParaCadastro" />
            </div>
        </div>

        <Loading v-if="carregando" />


        <div v-else class="gridConteudo">
            <CardHospede v-for="hospede in hospedesFiltrados" :key="hospede.id_hospede" :hospede="hospede" />
            <p v-if="!hospedesFiltrados.length">Nenhum hóspede encontrado para este filtro.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoAdicionar from '@/components/botoes/botaoAdicionar.vue';
import HospedeService from '@/services/HospedeService';
import CardHospede from '@/components/cards/CardHospede.vue';
import Loading from '@/components/Loading.vue'

/**
 * View para gerenciar todos os hóspedes cadastrados.
 * Exibe uma lista de hóspedes em cards, permitindo a visualização rápida
 * de suas informações e o acesso às funcionalidades de edição e check-in.
 */

const router = useRouter();
const toast = useToast();
const allHospedes = ref([]);
const hospedesFiltrados = ref([]);
const carregando = ref(true);

function irParaCadastro() {
    router.push('/admin/hospedes/cadastro');
}

onMounted(async () => {
    try {
        const hospedes = await HospedeService.listarHospedes();
        allHospedes.value = hospedes;
        hospedesFiltrados.value = listaHospedes.value; // Inicializa com todos os hóspedes
    } catch (error) {
        toast.error('Falha ao carregar a lista de hóspedes.');
    } finally {
        carregando.value = false;
    }
});

const listaHospedes = computed(() => {
    return allHospedes.value.map(hospede => {
        const alocado = hospede.id_quarto !== null && hospede.id_quarto !== undefined;
        return {
            ...hospede,
            status: alocado ? 'ALOCADO' : 'NÃO ALOCADO'
        };
    });
});
</script>

<style scoped>
/* Estilos podem ser copiados de GerenciarQuartos.vue para consistência */
.containerPagina {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.cabecalho {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.acoes {
    display: flex;
    gap: 1rem;
}

.gridConteudo {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.opcoes-filtro {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.botao-opcao {
    width: 100%;
    padding: 12px;
    text-align: left;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
}

.botao-opcao.ativo {
    background-color: #fff8f0;
    border-color: #f8a953;
    font-weight: bold;
}

.loading-container {
    text-align: center;
    padding: 2rem;
}
</style>