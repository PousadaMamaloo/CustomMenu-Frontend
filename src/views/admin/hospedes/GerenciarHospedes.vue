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
            <CardHospede v-for="hospede in listaHospedes" :key="hospede.id_hospede" :hospede="hospede" />
            <p v-if="!listaHospedes.length">Nenhum hóspede encontrado.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import BotaoAdicionar from '@/components/botoes/botaoAdicionar.vue';
import HospedeService from '@/services/HospedeService';
import CardHospede from '@/components/cards/CardHospede.vue';
import Loading from '@/components/Loading.vue'

const router = useRouter();
const toast = useToast();
const listaHospedes = ref([]);
const carregando = ref(true);

function irParaCadastro() {
    router.push('/admin/hospedes/cadastro');
}

onMounted(async () => {
    try {
        listaHospedes.value = await HospedeService.listarHospedes();
    } catch (error) {
        toast.error('Falha ao carregar a lista de hóspedes.');
    } finally {
        carregando.value = false;
    }
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

.loading-container {
    text-align: center;
    padding: 2rem;
}
</style>