<template>
    <div class="paginaPedido">
        <BotaoVoltar destino="/hospede/home" textPage="Voltar para Home" />

        <div v-if="carregandoItens" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Carregando dados do evento...</p>
        </div>

        <div v-else-if="!evento" class="error-container">
            <p>Erro ao carregar os dados do evento. Por favor, tente novamente.</p>
            <button @click="voltarParaHome" class="botao-voltar">Voltar para Home</button>
        </div>

        <div v-else class="conteudoPedido">
            <div class="colunaEsquerda">
                <!-- Informações do Evento -->
                <div class="infoEvento">
                    <h2>{{ evento.nome_evento }}</h2>
                    <p v-if="evento.desc_evento">{{ evento.desc_evento }}</p>
                    <div class="dataEvento">
                        <i class="mdi mdi-calendar"></i>
                        {{ dataAtual }}
                    </div>
                </div>

                <!-- Seleção de Horário -->
                <div class="selecaoHorario">
                    <h3>Selecione o Horário</h3>
                    <p class="subtituloHorario">Escolha um dos horários disponíveis para a entrega</p>
                    <div class="horariosDisponiveis">
                        <button v-for="(horarioObj, index) in horarios" :key="index"
                            :class="{ selecionado: horarioObj === horarioSelecionado }"
                            @click="selecionarHorario(horarioObj)">
                            {{ horarioObj.horario }}
                        </button>
                    </div>
                </div>

                <!-- Resumo do Pedido -->
                <div class="resumoPedido">
                    <h3>Resumo do Pedido</h3>
                    <div class="estatisticas">
                        <div class="estatCard">
                            <div class="estatNumero">{{ totalItens }}</div>
                            <div class="estatLabel">Itens Selecionados</div>
                        </div>
                        <div class="estatCard">
                            <div class="estatNumero">{{ valorTotal }}</div>
                            <div class="estatLabel">Valor Total</div>
                        </div>
                    </div>
                </div>

                <!-- Observações -->
                <div class="observacoes">
                    <h3>Observações</h3>
                    <textarea v-model="observacao" placeholder="Alguma observação especial para seu pedido?"
                        maxlength="300"></textarea>
                    <div class="contadorCaracteres">{{ observacao.length }}/300</div>
                </div>

                <!-- Botões de Ação -->
                <div v-if="evento && !carregandoItens" class="acoesPedido">
                    <button class="botaoEnviar" @click="enviarPedido" :disabled="enviando || !podeEnviarPedido">
                        <i class="mdi mdi-send"></i>
                        <span v-if="enviando">{{ editandoPedido ? 'Atualizando...' : 'Enviando...' }}</span>
                        <span v-else>{{ editandoPedido ? 'Atualizar Pedido' : 'Enviar Pedido' }}</span>
                    </button>
                    <button v-if="editandoPedido" class="botaoExcluir" @click="excluirPedido" :disabled="enviando">
                        <i class="mdi mdi-delete"></i>
                        Excluir Pedido
                    </button>
                </div>
            </div>

            <div class="colunaDireita">
                <!-- Lista de Itens -->
                <div v-if="todosOsItens.length > 0" class="listaItens">
                    <div v-for="item in todosOsItens" :key="item.id_item" class="itemPedido">
                        <img :src="item.foto_item || item.imagem || item.foto || '/quarto_placeholder.png'"
                            :alt="item.nome_item || item.nome" class="itemImg" />
                        <div class="itemInfo">
                            <span class="itemNome">{{ item.nome_item || item.nome }}</span>
                            <span class="itemDesc">{{ item.desc_item || item.descricao }}</span>
                            <div class="itemDetalhes">
                                <span v-if="item.valor_item || item.preco" class="itemPreco">R$ {{
                                    formatarPreco(item.valor_item || item.preco) }}</span>
                                <span v-if="item.qntd_max_hospede" class="itemLimite">Máx: {{ item.qntd_max_hospede
                                    }}</span>
                            </div>
                        </div>
                        <div class="itemAcoes">
                            <div class="contador">
                                <button @click="diminuirQuantidade(item)" :disabled="item.quantidade === 0">
                                    <i class="mdi mdi-minus"></i>
                                </button>
                                <span class="quantidade">{{ item.quantidade }}</span>
                                <button @click="aumentarQuantidade(item)"
                                    :disabled="item.quantidade >= (item.qntd_max_hospede || 999)">
                                    <i class="mdi mdi-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="sem-itens">
                    <p>Nenhum item disponível para este evento.</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import CardapioService from '@/services/CardapioService';
import PedidoService from '@/services/PedidoService';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const eventoId = ref(null);
const evento = ref(null);
const todosOsItens = ref([]);
const carregandoItens = ref(true);
const enviando = ref(false);
const pedidosExistentes = ref([]);
const editandoPedido = ref(null);

const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

const horarioSelecionado = ref(null);
const observacao = ref('');

const horarios = computed(() => {
    if (!evento.value || !evento.value.horarios) return [];

    // Agora horarios é um array de objetos com { id_horario, horario }
    const horariosData = evento.value.horarios;

    if (Array.isArray(horariosData)) {
        return horariosData.map(h => {
            // Se for objeto com horario, manter o objeto completo
            if (typeof h === 'object' && h.horario) {
                return h;
            }
            // Se for string diretamente, criar objeto
            return {
                id_horario: null,
                horario: h
            };
        });
    }

    // Se for string, tentar fazer parse JSON
    if (typeof horariosData === 'string') {
        try {
            const parsed = JSON.parse(horariosData);
            if (Array.isArray(parsed)) {
                return parsed.map(h => {
                    if (typeof h === 'object' && h.horario) {
                        return h;
                    }
                    return {
                        id_horario: null,
                        horario: h
                    };
                });
            }
            return [{
                id_horario: null,
                horario: horariosData
            }];
        } catch (e) {
            return [{
                id_horario: null,
                horario: horariosData
            }];
        }
    }

    return [];
});

// Computed para estatísticas
const totalItens = computed(() => {
    return todosOsItens.value.reduce((total, item) => total + item.quantidade, 0);
});

const valorTotal = computed(() => {
    const total = todosOsItens.value.reduce((total, item) => {
        const preco = item.valor_item || item.preco || 0;
        return total + (item.quantidade * preco);
    }, 0);
    return `R$ ${total.toFixed(2).replace('.', ',')}`;
});

const podeEnviarPedido = computed(() => {
    return horarioSelecionado.value && horarioSelecionado.value.id_horario && totalItens.value > 0;
});

onMounted(async () => {
    eventoId.value = route.query.evento;

    if (!eventoId.value) {
        toast.error("ID do evento não fornecido.");
        router.push('/hospede/home');
        return;
    }

    // Converter para número se for string
    const eventoIdNumero = parseInt(eventoId.value);
    if (isNaN(eventoIdNumero)) {
        toast.error("ID do evento inválido.");
        router.push('/hospede/home');
        return;
    }

    eventoId.value = eventoIdNumero;

    try {
        carregandoItens.value = true;

        // Buscar dados completos do evento (incluindo itens)
        const dadosCompletos = await CardapioService.listarItensPorEvento(eventoId.value);

        if (dadosCompletos && dadosCompletos.data) {
            const dados = dadosCompletos.data;

            // Configurar dados do evento
            evento.value = {
                id_evento: eventoId.value,
                nome_evento: dados.nome_evento,
                desc_evento: dados.desc_evento,
                datas: dados.datas,
                horarios: dados.horarios
            };

            // Configurar itens
            if (dados.itens && Array.isArray(dados.itens)) {
                todosOsItens.value = dados.itens.map(item => ({
                    ...item,
                    quantidade: 0,
                    // Garantir que os campos necessários existem
                    nome: item.nome_item || item.nome,
                    descricao: item.desc_item || item.descricao,
                    preco: item.valor_item || item.preco,
                    imagem: item.foto_item || item.imagem || item.foto,
                    categoria: item.categ_item || item.categoria,
                    qntd_max_hospede: item.qntd_max_hospede || 999 // Garantir que existe com valor padrão
                }));
            } else {
                todosOsItens.value = [];
            }
        } else {
            throw new Error('Estrutura de dados inesperada do servidor');
        }

        // Carregar pedidos existentes do quarto para este evento
        const idQuarto = authStore.user?.id_quarto;
        if (idQuarto) {
            try {
                const pedidosData = await PedidoService.listarPedidosQuartoEvento(idQuarto, eventoId.value);
                pedidosExistentes.value = pedidosData;

                // Se há pedidos existentes, pode carregar o primeiro para edição
                if (pedidosData.length > 0) {
                    carregarPedidoParaEdicao(pedidosData[0]);
                }
            } catch (error) {
                // Ignorar erro se não houver pedidos
            }
        }

    } catch (error) {
        toast.error("Falha ao carregar os dados do evento.");
    } finally {
        carregandoItens.value = false;
    }
});

function formatarPreco(preco) {
    return Number(preco || 0).toFixed(2).replace('.', ',');
}

function selecionarHorario(horarioObj) {
    horarioSelecionado.value = horarioObj;
}

function voltarParaHome() {
    router.push('/hospede/home');
}

function carregarPedidoParaEdicao(pedido) {
    editandoPedido.value = pedido;

    // Definir horário selecionado - buscar o horário pelo ID
    if (pedido.id_horario && evento.value.horarios) {
        const horarioObj = evento.value.horarios.find(h =>
            h.id_horario === pedido.id_horario
        );
        if (horarioObj) {
            horarioSelecionado.value = horarioObj; // Agora armazenamos o objeto completo
        }
    }

    // Definir observação
    if (pedido.obs_pedido || pedido.observacao) {
        observacao.value = pedido.obs_pedido || pedido.observacao;
    }

    // Carregar quantidades dos itens
    if (pedido.itens && Array.isArray(pedido.itens)) {
        pedido.itens.forEach(itemPedido => {
            const itemEncontrado = todosOsItens.value.find(item =>
                item.id_item === itemPedido.id_item ||
                item.id_produto === itemPedido.id_produto // Fallback para compatibilidade
            );
            if (itemEncontrado) {
                itemEncontrado.quantidade = itemPedido.qntd_item || itemPedido.quantidade;
            }
        });
    }

    toast.info('Carregando seu pedido existente para edição.');
}

function aumentarQuantidade(item) {
    const quantidadeMaxima = item.qntd_max_hospede || 999;

    if (item.quantidade >= quantidadeMaxima) {
        toast.warning(`Quantidade máxima permitida para este item: ${quantidadeMaxima}`);
        return;
    }

    item.quantidade++;
}

function diminuirQuantidade(item) {
    if (item.quantidade > 0) {
        item.quantidade--;
    }
}

async function enviarPedido() {
    if (!horarioSelecionado.value || !horarioSelecionado.value.id_horario) {
        toast.warning('Por favor, selecione um horário válido para a entrega.');
        return;
    }

    const itensPedido = todosOsItens.value
        .filter(item => item.quantidade > 0)
        .map(item => ({
            id_item: item.id_item,
            qntd_item: item.quantidade
        }));

    if (itensPedido.length === 0) {
        toast.warning('Selecione pelo menos um item para o seu pedido.');
        return;
    }

    // Verificar se temos o ID do quarto
    const idQuarto = authStore.user?.id_quarto;
    if (!idQuarto) {
        toast.error("ID do quarto não identificado. Faça o login novamente.");
        router.push('/hospede/login');
        return;
    }

    // Encontrar o ID do horário selecionado
    const idHorario = horarioSelecionado.value.id_horario;
    if (!idHorario) {
        toast.error("Erro ao identificar o horário selecionado.");
        return;
    }

    const pedido = {
        id_quarto: idQuarto,
        id_evento: eventoId.value,
        id_horario: idHorario,
        obs_pedido: observacao.value || null,
        itens: itensPedido
    };

    enviando.value = true;
    try {
        if (editandoPedido.value) {
            // Atualizar pedido existente
            await PedidoService.editarPedido(editandoPedido.value.id_pedido, pedido);
            toast.success('Pedido atualizado com sucesso!');
        } else {
            // Criar novo pedido
            await PedidoService.criarPedido(pedido);
            toast.success('Pedido enviado com sucesso!');
        }
        router.push('/hospede');
    } catch (error) {
        const acao = editandoPedido.value ? 'atualizar' : 'enviar';
        toast.error(`Erro ao ${acao} o pedido. Tente novamente mais tarde.`);
    } finally {
        enviando.value = false;
    }
}

async function excluirPedido() {
    if (!editandoPedido.value) {
        return;
    }

    const result = await Swal.fire({
        title: 'Excluir Pedido',
        text: 'Tem certeza de que deseja excluir este pedido? Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD7373',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
        return;
    }

    enviando.value = true;
    try {
        await PedidoService.excluirPedido(editandoPedido.value.id_pedido);

        await Swal.fire({
            title: 'Sucesso!',
            text: 'Pedido excluído com sucesso!',
            icon: 'success',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK'
        });

        router.push('/hospede');
    } catch (error) {
        await Swal.fire({
            title: 'Erro!',
            text: 'Erro ao excluir o pedido. Tente novamente mais tarde.',
            icon: 'error',
            confirmButtonColor: '#DC3545',
            confirmButtonText: 'OK'
        });
    } finally {
        enviando.value = false;
    }
}
</script>

<style scoped>
/* Reset básico para botões */
button {
    all: unset;
    box-sizing: border-box;
}

.paginaPedido {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #f8a953;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-container .botao-voltar {
    background: #f8a953;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 16px;
}

.conteudoPedido {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
}

.colunaEsquerda {
    width: 100%;
}

.colunaDireita {
    width: 100%;
}

/* Informações do Evento */
.infoEvento {
    background: linear-gradient(135deg, #f8a953, #d48946);
    color: white;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
}

.infoEvento h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
}

.infoEvento p {
    margin: 0 0 12px 0;
    opacity: 0.9;
    font-size: 16px;
}

.dataEvento {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
}

.dataEvento i {
    font-size: 16px;
}

/* Seleção de Horário */
.selecaoHorario {
    background: white;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    margin-bottom: 24px;
}

.selecaoHorario h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.subtituloHorario {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #6b7280;
}

.horariosDisponiveis {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.horariosDisponiveis button {
    padding: 12px 20px;
    border: 2px solid #e5e7eb;
    border-radius: 25px;
    background: white;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.horariosDisponiveis button:hover {
    border-color: #f8a953;
    background: #fff9f0;
}

.horariosDisponiveis button.selecionado {
    background: #f8a953;
    border-color: #f8a953;
    color: white;
}

/* Resumo do Pedido */
.resumoPedido {
    background: white;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    margin-bottom: 24px;
}

.resumoPedido h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.estatisticas {
    display: flex;
    gap: 16px;
}

.estatCard {
    flex: 1;
    background: #f8f9fa;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #e9ecef;
}

.estatNumero {
    font-size: 24px;
    font-weight: 700;
    color: #f8a953;
    margin-bottom: 4px;
}

.estatLabel {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}

/* Observações */
.observacoes {
    background: white;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
}

.observacoes h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.observacoes textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    box-sizing: border-box;
}

.observacoes textarea:focus {
    outline: none;
    border-color: #f8a953;
    box-shadow: 0 0 0 3px rgba(248, 169, 83, 0.1);
}

.contadorCaracteres {
    text-align: right;
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}

/* Lista de Itens */
.listaItens {
    display: grid;
    gap: 16px;
}

.itemPedido {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;
}

.itemPedido:hover {
    border-color: #f8a953;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.itemImg {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    background: #f3f4f6;
}

.itemInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.itemNome {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
}

.itemDesc {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.4;
}

.itemDetalhes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
}

.itemPreco {
    font-size: 16px;
    font-weight: 600;
    color: #f8a953;
}

.itemLimite {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 12px;
}

.itemAcoes {
    display: flex;
    align-items: center;
}

.contador {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #e9ecef;
}

.contador button {
    width: 32px;
    height: 32px;
    background: #f8a953;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.contador button:hover:not(:disabled) {
    background: #d48946;
    transform: scale(1.1);
}

.contador button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    background: #9ca3af;
}

.contador button i {
    font-size: 16px;
}

.quantidade {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    min-width: 24px;
    text-align: center;
}

.sem-itens {
    text-align: center;
    padding: 40px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px dashed #dee2e6;
}

.sem-itens p {
    margin: 0;
    color: #6c757d;
    font-size: 16px;
    font-weight: 500;
}

/* Ações do Pedido */
.acoesPedido {
    position: sticky;
    bottom: 24px;
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
}

.botaoEnviar {
    background: linear-gradient(135deg, #f8a953, #d48946);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.botaoEnviar:hover:not(:disabled) {
    background: linear-gradient(135deg, #d48946, #b8713a);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(248, 169, 83, 0.3);
}

.botaoEnviar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.botaoExcluir {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.botaoExcluir:hover:not(:disabled) {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
}

.botaoExcluir:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Responsividade */
@media (min-width: 768px) {
    .conteudoPedido {
        flex-direction: row;
        gap: 32px;
        align-items: flex-start;
    }

    .colunaEsquerda {
        width: 380px;
        flex-shrink: 0;
    }

    .colunaDireita {
        flex: 1;
        max-width: 800px;
    }

    .acoesPedido {
        flex-direction: row;
        position: relative;
        bottom: auto;
    }

    .botaoEnviar {
        flex: 1;
    }

    .botaoExcluir {
        flex: 0 0 auto;
        min-width: 180px;
    }
}

@media (min-width: 1024px) {
    .listaItens {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 767px) {
    .paginaPedido {
        padding: 16px;
    }

    .estatisticas {
        flex-direction: column;
        gap: 12px;
    }

    .horariosDisponiveis {
        justify-content: center;
    }

    .horariosDisponiveis button {
        flex: 1;
        min-width: 80px;
    }
}
</style>