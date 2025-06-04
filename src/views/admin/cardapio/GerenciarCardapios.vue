<template>
    <div class="paginaRefeicoes">
        <div class="cabecalhoRefeicoes">
            <BotaoVoltar destino="/" textPage="Gerenciar Refeições" />
            <button class="botaoAdicionar" @click="criarrefeicao">+ Novo refeicao</button>
        </div>

        <div class="listaRefeicoes">
            <CardRefeicao v-for="Refeicao in Refeicoes" :key="Refeicao.id" :Refeicao="Refeicao" @editar="irParaEditar"
                @cardapio="irParaCardapio" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CardRefeicao from '@/components/cards/CardRefeicao.vue';
import BotaoVoltar from '@/components/botoes/BotaoVoltar.vue';

const router = useRouter();

const Refeicoes = ref([
    { id: 1, nome: 'Café da manhã', recorrente: true, todosHospedes: true },
    { id: 2, nome: 'Almoço', recorrente: true, todosHospedes: false },
    { id: 3, nome: 'Jantar', recorrente: false, todosHospedes: true },
    { id: 4, nome: 'Chá da tarde', recorrente: true, todosHospedes: false },
    { id: 5, nome: 'Festa de Aniversário', recorrente: false, todosHospedes: true }
]);

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
    padding: 20px;
    margin: 0 auto;
}

.cabecalhoRefeicoes {
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

.listaRefeicoes {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-evenly;
}
</style>
