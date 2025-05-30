<template>
    <div class="paginaEventos">
        <div class="cabecalhoEventos">
            <BotaoVoltar destino="/" textPage="Gerenciar Eventos" />
            <button class="botaoAdicionar" @click="criarEvento">+ Novo Evento</button>
        </div>

        <div class="listaEventos">
            <CardEvento v-for="evento in eventos" :key="evento.id" :evento="evento" @editar="irParaEditar"
                @cardapio="irParaCardapio" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CardEvento from '@/components/cards/CardEvento.vue';
import BotaoVoltar from '@/components/botoes/BotaoVoltar.vue';

const router = useRouter();

const eventos = ref([
    { id: 1, nome: 'Café da manhã', recorrente: true, todosHospedes: true },
    { id: 2, nome: 'Almoço', recorrente: true, todosHospedes: false },
    { id: 3, nome: 'Jantar', recorrente: false, todosHospedes: true },
    { id: 4, nome: 'Chá da tarde', recorrente: true, todosHospedes: false },
    { id: 5, nome: 'Festa de Aniversário', recorrente: false, todosHospedes: true }
]);

function criarEvento() {
    router.push('/admin/evento/cadastro');
}

function irParaEditar(id) {
    router.push(`/admin/evento/editar/${id}`)
}

function irParaCardapio(id) {
    router.push(`/admin/evento/cardapio/${id}`)
}
</script>

<style scoped>
.paginaEventos {
    padding: 20px;
    margin: 0 auto;
}

.cabecalhoEventos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
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
}

.botaoAdicionar:hover {
    background-color: #d48833;
}

.listaEventos {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-evenly;
}
</style>
