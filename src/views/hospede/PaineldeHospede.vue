<template>
    <div class="painelContainer">
        <div class="painelBoasVindas">
            <!-- Usamos o store para exibir o nome do utilizador -->
            <span class="painelOla">Olá, {{ authStore.user?.nome || 'Hóspede' }}!</span>
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
            <div v-for="evento in eventos" :key="evento.id_evento" class="painelCard"
                @click="irParaPedido(evento.id_evento)">
                <div class="painelIcone">
                    <span class="mdi mdi-calendar-clock"></span>
                </div>
                <div class="painelCardContent">
                    <h3 class="painelCardTitulo">{{ evento.nome_evento }}</h3>
                    <p class="painelCardDescricao" v-if="evento.desc_evento">{{ evento.desc_evento }}</p>
                    <div class="painelCardHorario">
                        <span class="mdi mdi-clock-outline"></span>
                        {{ formatarHorarios(evento.horarios) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CardapioService from '@/services/CardapioService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const eventos = ref([]);
const carregando = ref(true);
const erro = ref(null);

function formatarHorarios(horarios) {
    if (!horarios || horarios.length === 0) {
        return 'Horário a confirmar';
    }
    if (Array.isArray(horarios)) {
        if (horarios.length === 1) {
            return horarios[0].slice(0, 5);
        }
        const primeiro = horarios[0].slice(0, 5);
        const ultimo = horarios[horarios.length - 1].slice(0, 5);
        return `${primeiro} - ${ultimo}`;
    }
    if (typeof horarios === 'string') {
        return horarios.slice(0, 5);
    }
    return 'Horário a confirmar';
}

onMounted(async () => {
    try {
        carregando.value = true;
        const dadosEventos = await CardapioService.listarEventosParaHospede();
        eventos.value = dadosEventos;
    } catch (e) {
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    justify-content: center;
}

.painelCard {
    width: 280px;
    min-height: 180px;
    border: none;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    transition: all 0.3s ease;
    cursor: pointer;
    margin: 10px 0;
    border: 2px solid transparent;
}

.painelCard:hover {
    box-shadow: 0 8px 28px 0 rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    border-color: #f8a953;
}

.painelIcone {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    font-size: 24px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #f8a953, #d48946);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 12px rgba(248, 169, 83, 0.3);
}

.painelCardContent {
    flex: 1;
    width: 100%;
}

.painelCardTitulo {
    font-size: 18px;
    color: #1a1a1a;
    font-weight: 700;
    margin: 0 0 8px 0;
    line-height: 1.3;
    text-align: left;
}

.painelCardDescricao {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.painelCardHorario {
    font-size: 14px;
    color: #f8a953;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.feedback-container {
    text-align: center;
    padding: 2rem;
    color: #6c727f;
}

.feedback-container.erro {
    color: #e74c3c;
}

@media (max-width: 768px) {
    .painelContainer {
        margin-top: 20px;
        padding: 0 12px;
        gap: 24px;
    }

    .painelOpcoes {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .painelCard {
        width: 100%;
        padding: 20px;
        min-height: 160px;
    }

    .painelCardTitulo {
        font-size: 16px;
    }

    .painelIcone {
        width: 44px;
        height: 44px;
        font-size: 22px;
        margin-bottom: 12px;
    }
}

@media (max-width: 480px) {
    .painelTitulo {
        font-size: 20px;
    }

    .painelOla {
        font-size: 14px;
    }
}
</style>
