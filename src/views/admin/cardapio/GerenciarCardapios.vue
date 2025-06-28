<template>
    <div class="paginaRefeicoes">
        <div class="cabecalhoRefeicoes">
            <BotaoVoltar :destino="'/admin'" textPage="Gerenciar Refeições" />
            <button class="botaoAdicionar" @click="criarrefeicao">+ Nova refeição</button>
        </div>

        <Loading v-if="isLoading" />
        <div v-else-if="erroApi" class="erro">
            <p>{{ erroApi }}</p>
        </div>
        <div v-else-if="eventosFormatados.length > 0">
            <ContainerCards :items="eventosFormatados">
                <template #default="{ item }">
                    <CardRefeicao :Refeicao="item" @editar="irParaEditar" @cardapio="irParaCardapio" />
                </template>
            </ContainerCards>
        </div>
        <div v-else class="sem-eventos">
            <p>Nenhum evento cadastrado.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardRefeicao from '@/components/cards/CardRefeicao.vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import ContainerCards from '@/components/ContainerCards.vue';
import EventoService from '@/services/EventoService';
import Loading from '@/components/Loading.vue'

const router = useRouter();
const eventos = ref([]);
const isLoading = ref(true);
const erroApi = ref(null);

// Computed para formatar os eventos no formato esperado pelo CardRefeicao
const eventosFormatados = computed(() => {
    return eventos.value.map(evento => ({
        id: evento.id_evento,
        id_evento: evento.id_evento,
        nome_evento: evento.nome_evento,
        desc_evento: evento.desc_evento,
        publico_alvo: evento.publico_alvo,
        recorrencia: evento.recorrencia,
        sts_evento: evento.sts_evento,
        horarios_evento: evento.horarios_evento || evento.horarios || [],
        quantidade_itens: evento.quantidade_itens || 0
    }));
});

onMounted(async () => {
    try {
        isLoading.value = true;
        erroApi.value = null;
        const dadosEventos = await EventoService.listarEventos();
        eventos.value = dadosEventos;
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        erroApi.value = "Falha ao carregar os eventos. Tente novamente mais tarde.";
    } finally {
        isLoading.value = false;
    }
});

function criarrefeicao() {
    router.push('/admin/refeicao/cadastro');
}

function irParaEditar(id) {
    router.push(`/admin/refeicao/editar/${id}`)
}

function irParaCardapio(id) {
    router.push(`/admin/refeicao/cardapio/${id}`)
}
</script>

<style scoped>
.paginaRefeicoes {
    padding: 24px 16px 0 16px;
    margin: 0 auto;
    max-width: 900px;
    box-sizing: border-box;
}

.cabecalhoRefeicoes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
}

.botaoAdicionar {
    background-color: #f8a953;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.botaoAdicionar:hover {
    background-color: #d48833;
}

.carregando {
    text-align: center;
    padding: 40px 20px;
    color: #718096;
    font-size: 16px;
}

.erro {
    text-align: center;
    padding: 40px 20px;
    color: #e53e3e;
    font-size: 16px;
    background-color: #fed7d7;
    border-radius: 8px;
    margin: 20px 0;
}

.sem-eventos {
    text-align: center;
    padding: 40px 20px;
    color: #718096;
    font-size: 16px;
    background-color: #f7fafc;
    border-radius: 8px;
    margin: 20px 0;
}
</style>
