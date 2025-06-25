<template>
    <div class="painelContainer">
        <div class="painelBoasVindas">
            <span class="painelOla">Olá, {{ authState.guestInfo?.nome_hospede || 'Hóspede' }}!</span>
            <h2 class="painelTitulo">Eventos disponíveis para pedido</h2>
        </div>

        <div v-if="carregando" class="feedback-container">
            <p>Carregando eventos disponíveis...</p>
        </div>
        <div v-else-if="erro" class="feedback-container erro">
            <p>{{ erro }}</p>
        </div>
        <div v-else-if="eventos.length === 0" class="feedback-container">
            <p>Nenhum evento encontrado para você no momento.</p>
        </div>

        <div v-else class="painelOpcoes">
            <button v-for="evento in eventos" :key="evento.id_evento" class="painelCard"
                @click="irParaPedido(evento.id_evento)">
                <div class="painelIcone">
                    <span class="mdi mdi-calendar-clock"></span>
                </div>
                <div class="painelCardTitulo">{{ evento.nome_evento }}</div>
                <div class="painelCardHorario">{{ formatarHorarios(evento.horarios) }}</div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CardapioService from '@/services/CardapioService';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const toast = useToast();
const { authState } = useAuth();

const eventos = ref([]);
const carregando = ref(true);
const erro = ref(null);

// Formata o array de horários para uma string amigável
function formatarHorarios(horarios) {
    if (!horarios || horarios.length === 0) {
        return 'Horário a confirmar';
    }
    // Pega o primeiro e o último horário para exibir um intervalo
    const primeiro = horarios[0].slice(0, 5);
    const ultimo = horarios[horarios.length - 1].slice(0, 5);
    return `${primeiro} - ${ultimo}`;
}

onMounted(async () => {
    try {
        carregando.value = true;
        // A API usará o token do hóspede logado para encontrar os eventos corretos
        const dadosEventos = await CardapioService.listarEventosParaHospede();
        eventos.value = dadosEventos;
    } catch (e) {
        console.error("Erro ao buscar eventos para o hóspede:", e);
        erro.value = "Não foi possível carregar os eventos disponíveis.";
        toast.error(erro.value);
    } finally {
        carregando.value = false;
    }
});

function irParaPedido(eventoId) {
    router.push(`/hospede/pedido?evento=${eventoId}`);
}
</script>

<style scoped>
.painelContainer {
    display: flex;
    flex-direction: column;
    gap: 36px;
    margin: 0 auto;
    margin-top: 56px;
    max-width: 900px;
    padding: 0 16px;
}

.painelBoasVindas {
    margin-bottom: 12px;
}

.painelOla {
    font-size: 15px;
    color: #222;
}

.painelTitulo {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.painelOpcoes {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: flex-start;
}

.painelCard {
    width: 260px;
    height: 170px;
    border: none;
    background-color: #fff;
    border-radius: 22px;
    box-shadow: 0 4px 18px 0 #00000014;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 28px;
    justify-content: center;
    transition: box-shadow 0.2s;
    cursor: pointer;
    margin: 10px 0;
}

.painelCard:hover {
    box-shadow: 0 8px 28px 0 #00000024;
}

.painelIcone {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    font-size: 32px;
    margin-bottom: 12px;
    background-color: #f8a95366;
    border-radius: 50%;
    color: #d17d2f;
}

.painelCardTitulo {
    font-size: 17px;
    color: #6c727f;
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    text-align: left;
    margin-bottom: 8px;
}

.painelCardHorario {
    font-size: 15px;
    color: #a1a1a1;
}

.feedback-container {
    text-align: center;
    padding: 2rem;
    color: #6c727f;
}

.feedback-container.erro {
    color: #e74c3c;
}
</style>