<template>
    <div class="painelContainer">
        <div class="painelBoasVindas">
            <span class="painelOla">Olá, Hóspede!</span>
            <h2 class="painelTitulo">Eventos disponíveis para pedido</h2>
        </div>
        <div class="painelOpcoes">
            <button v-for="evento in eventos" :key="evento.id" class="painelCard" @click="irParaPedido(evento.id)">
                <div class="painelIcone">
                    <span class="mdi mdi-calendar"></span>
                </div>
                <div class="painelCardTitulo">{{ evento.nome }}</div>
                <div class="painelCardHorario">{{ evento.horario }}</div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// Mock de eventos disponíveis para o hóspede
const eventos = [
    { id: 1, nome: 'Café da Manhã', horario: '07:00 - 10:00' },
    { id: 2, nome: 'Almoço', horario: '12:00 - 14:00' },
    { id: 3, nome: 'Jantar', horario: '18:00 - 21:00' }
]

function irParaPedido(eventoId) {
    // No futuro, redirecionar para a tela de pedido do evento
    router.push(`/hospede/pedido?evento=${eventoId}`)
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
</style>