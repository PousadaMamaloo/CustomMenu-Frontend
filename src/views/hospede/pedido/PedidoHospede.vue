<template>
    <div class="pedidoContainer">
        <BotaoVoltar destino="/hospede/home" textPage="Voltar para Home" />

        <div class="headerHorario">
            <h1>Café da manhã Mamaloo {{ dataAtual }}</h1>
        </div>

        <div class="blocoHorarioHistorico">
            <div class="horarioCafe">
                <div class="formularioHorario">
                    <h2>Selecione o Horário</h2>
                    <p class="subtituloHorario"> Esses são os horários disponíveis, caso nenhum lhe agrade, consulte a
                        gestão!</p>
                    <div class="horariosDisponiveis">
                        <button v-for="(horario, index) in horarios" :key="index"
                            :class="{ selecionado: horario === horarioSelecionado }"
                            @click="selecionarHorario(horario)">
                            {{ horario }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="historicoCafe">
                <button @click="abrirHistorico">
                    Consultar o histórico de pedidos
                    <p class="subtituloHorario"> Clique aqui para ver os seus pedidos já feitos </p>
                </button>

            </div>
        </div>
        <div class="wrapperComidaBebida">
            <div class="comidaPedido">
                <h2>🍽️ O que deseja comer?</h2>
                <div class="listaComidas">
                    <div class="itemComida" v-for="(item, index) in comidas" :key="index">
                        <img :src="item.imagem" alt="Imagem do item" class="imagemComida" />
                        <div class="infoComida">
                            <div class="descricaoItem">
                                <div class="tituloItem">{{ item.nome }}</div>
                                <div class="textoDescricao">{{ item.descricao }}</div>
                            </div>
                            <div class="contador">
                                <button @click="diminuirQuantidade(item)">-</button>
                                <span>{{ item.quantidade }}</span>
                                <button @click="aumentarQuantidade(item)">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bebidaPedido">
                    <h2>🥤 O que vai beber?</h2>
                    <div class="listaBebidas">
                        <div class="itemComida" v-for="(item, index) in bebidas" :key="index">
                            <img :src="item.imagem" alt="Imagem da bebida" class="imagemComida" />
                            <div class="infoComida">
                                <div class="descricaoItem">
                                    <div class="tituloItem">{{ item.nome }}</div>
                                    <div class="textoDescricao">{{ item.descricao }}</div>
                                </div>
                                <div class="contador">
                                    <button @click="diminuirQuantidade(item)">-</button>
                                    <span>{{ item.quantidade }}</span>
                                    <button @click="aumentarQuantidade(item)">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="observacaoPedido">
            <h2>Observações sobre o Pedido</h2>
            <textarea v-model="observacao" placeholder="" maxlength="200"></textarea>
        </div>

        <div class="envioPedido">
            <button class="botaoEnviar" @click="enviarPedido" :disabled="enviando">
                <span v-if="enviando">Enviando...</span>
                <span v-else>Enviar Pedido</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CardapioService from '@/services/CardapioService';
import PedidoService from '@/services/PedidoService';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const toast = useToast();
// Instanciamos o store
const authStore = useAuthStore();

const eventoId = ref(null);
const evento = ref(null);
const todosOsItens = ref([]);
const carregandoItens = ref(true);
const enviando = ref(false);

const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

const horarioSelecionado = ref(null);
const observacao = ref('');

const horarios = computed(() => evento.value?.horarios || []);

const comidas = computed(() => todosOsItens.value.filter(item => item.categoria?.nome_categoria?.toLowerCase().includes('comida')));
const bebidas = computed(() => todosOsItens.value.filter(item => item.categoria?.nome_categoria?.toLowerCase().includes('bebida')));

onMounted(async () => {
    eventoId.value = route.query.evento;
    if (!eventoId.value) {
        toast.error("ID do evento não fornecido.");
        router.push('/hospede');
        return;
    }

    try {
        carregandoItens.value = true;
        const eventoData = await CardapioService.obterEventoPorId(eventoId.value);
        evento.value = eventoData;

        const itensData = await CardapioService.listarItensPorEvento(eventoId.value);
        todosOsItens.value = itensData.map(item => ({ ...item, quantidade: 0 }));

    } catch (error) {
        toast.error("Falha ao carregar os dados do evento.");
        console.error(error);
    } finally {
        carregandoItens.value = false;
    }
});

function selecionarHorario(horario) {
    horarioSelecionado.value = horario;
}

function abrirHistorico() {
    toast.info('A funcionalidade de histórico de pedidos ainda será implementada.');
}

function aumentarQuantidade(item) {
    item.quantidade++;
}

function diminuirQuantidade(item) {
    if (item.quantidade > 0) {
        item.quantidade--;
    }
}

function formatarHorario(horario) {
    if (horario && horario.includes(':')) {
        return horario.split(':').slice(0, 2).join(':');
    }
    return horario;
}

async function enviarPedido() {
    if (!horarioSelecionado.value) {
        toast.warning('Por favor, selecione um horário para a entrega.');
        return;
    }

    const itensPedido = todosOsItens.value
        .filter(item => item.quantidade > 0)
        .map(item => ({ id_produto: item.id_produto, quantidade: item.quantidade }));

    if (itensPedido.length === 0) {
        toast.warning('Selecione pelo menos um item para o seu pedido.');
        return;
    }

    const idHospede = authStore.user?.id_hospede;
    if (!idHospede) {
        toast.error("Hóspede não identificado. Faça o login novamente.");
        router.push('/hospede/login');
        return;
    }

    const pedido = {
        id_hospede: idHospede,
        id_evento: eventoId.value,
        horario_entrega: horarioSelecionado.value,
        observacao: observacao.value,
        itens: itensPedido
    };

    enviando.value = true;
    try {
        await PedidoService.criarPedido(pedido);
        toast.success('Pedido enviado com sucesso!');
        router.push('/hospede');
    } catch (error) {
        toast.error('Erro ao enviar o pedido. Tente novamente mais tarde.');
        console.error(error);
    } finally {
        enviando.value = false;
    }
}
</script>

<style scoped>
button {
    all: unset;
}

.pedidoContainer {
    padding: 24px;
    max-width: 1400px;
}

.headerHorario {
    display: flex;
    align-items: center;
    width: 342px;
    height: 26px;
}

.horarioCafe {
    width: 327px;
    background-color: #FFFFFF;
    border-radius: 12px;
    margin-top: 50px;
    border: 1px solid #DDDDE3;
    box-sizing: border-box;
}

.formularioHorario {
    font-size: 16px;
    margin-top: 20px;
    margin-left: 30px;
    gap: 8px;
}

.subtituloHorario {
    width: 191px;
    height: 34px;
    margin-top: 8px;
    margin-bottom: 18px;
    font-size: 12px;
    color: #828686;
}

.horariosDisponiveis button {
    padding: 10px 24px 10px 24px;
    margin: 8px;
    border: 1px solid #D0DBEA;
    border-radius: 100px;
    background-color: #FFFFFF;
    cursor: pointer;
    transition: 0.3s;
}

.horariosDisponiveis button.selecionado {
    background-color: #FD9519;
    color: white;
}

.historicoCafe {
    width: 327px;
    height: 59px;
    background-color: #F5F5F5;
    padding: 5px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #DDDDE3;
    cursor: pointer;
    margin-top: 32px;
    text-align: center;
}

.subtituloHorario {
    font-size: 12px;
    color: #808089;
    margin-bottom: 10px;
}

.comidaPedido {
    margin-top: 32px;
}

.listaComidas {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
}

.itemComida {
    display: flex;
    width: 344px;
    height: 88px;
    font-size: 15px;
    gap: 16px;
    background-color: #FFFFFF;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    padding: 12px;
    border-radius: 16px;
}

.imagemComida {
    width: 74px;
    height: 66px;
    border-radius: 10px;
}

.infoComida {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 12px;
}

.descricaoItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 10px;
    color: #828686;
    max-width: 148px;
}

.tituloItem {
    font-size: 14px;
    font-weight: bold;
    color: black;
    margin-bottom: 15px;
}

.textoDescricao {
    font-size: 10px;
    color: #828686;
}

.contador {
    display: flex;
    font-size: 12px;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: #ffffff;
}

.contador button {
    background-color: #F6B10080;
    color: white;
    border: none;
    padding: 4px 10px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
}

.bebidaPedido {
    margin-top: 32px;
}

.listaBebidas {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
}

.itemBebida {
    display: flex;
    width: 344px;
    height: 88px;
    font-size: 15px;
    gap: 16px;
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 8px;
}

.imagemBebida {
    width: 74px;
    height: 66px;
    border-radius: 8px;
}

.infoBebida {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 12px;
}

.observacaoPedido {
    width: 327px;
    height: 123px;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
}

.observacaoPedido textarea {
    width: 327px;
    height: 123px;
    padding: 5px;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid #D0DBEA;
    resize: none;
    font-size: 14px;
}

.contadorCaracteres {
    align-self: flex-end;
    font-size: 12px;
    color: #D0DBEA;
    margin-top: 4px;
}

.envioPedido {
    margin-top: 32px;
    display: flex;
    justify-content: center;
}

.botaoEnviar {
    background-color: #F8A953;
    color: white;
    width: 330px;
    height: 46px;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 322px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (min-width: 470px) {
    .pedidoContainer {
        display: grid;
        grid-template-columns: 300px 1fr;
        column-gap: 20px;
        row-gap: 20px;
        align-items: start;
        margin-left: 60px;
        margin-right: 240px;
    }

    .headerHorario {
        grid-column: 1 / -1;
        grid-row: 1;
        margin-bottom: 20px;
    }

    .blocoHorarioHistorico {
        grid-column: 1;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: -19px;
    }

    .historicoCafe {
        background-color: #FFFFFF;

    }

    .blocoHorarioHistorico > .historicoCafe {
        order: 1;
        margin: 0;
    }

    .blocoHorarioHistorico > .horarioCafe {
        order: 2;
        margin: 0;
    }

    .observacaoPedido {
        grid-column: 1;
        grid-row: 3;
        width: 328px;
        height: 153px;
        margin-top: -300px;
    }

    .observacaoPedido textarea {
        box-sizing: border-box;
    }

    .wrapperComidaBebida {
        grid-column: 2;
        grid-row: 2;
        align-self: start;
        margin-left: 200px;
        width: 600px;
        margin-top: 0;
        max-height: 600px;
        overflow-y: auto;
        box-sizing: border-box;
    }

    .comidaPedido,
    .bebidaPedido {
        grid-column: auto;
        grid-row: auto;
        margin-left: 0;
        overflow-y: visible;
        padding-right: 0;
        box-sizing: content-box;
    }

    .tituloItem {
        font-size: 18px;
        width: 200px;
        overflow: auto;
    }

    .textoDescricao {
        font-size: 10px;
    }

    .comidaPedido {
        margin-top: 0;
    }

    .itemComida {
        width: 600px;
    }

    .itemBebida {
        width: 600px;
    }

    .contador {
        font-weight: bold;
    }

    .contador button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F6B100;
        width: 40px;
        height: 40px;
        font-size: 20px;
        font-weight: bold;
    }

    .envioPedido {
        grid-column: 1 / -1;
        grid-row: 4;
        margin-top: 0px;
        align-self: start;
        justify-self: center;
    }
}
</style>
