<template>
    <div class="paginaRelatorioEvento">
        <div class="divBotaoVoltar">
            <BotaoVoltar :destino="'/admin/pedidos'" />
        </div>

        <div class="relatorioCabecalho">
            <h2 class="relatorioTitulo">Relatório Geral do Evento</h2>
            <button class="relatorioDownload" @click="baixarRelatorio">
                <span class="mdi mdi-download"></span>
            </button>
        </div>

        <!-- Seleção de evento -->
        <div class="relatorioSelecaoEvento">
            <label for="eventoSelect">Evento:</label>
            <select id="eventoSelect" v-model="eventoSelecionado">
                <option v-for="evento in eventosDisponiveis" :key="evento.id" :value="evento.id">
                    {{ evento.nome }}
                </option>
            </select>
        </div>

        <!-- Tabela de itens totais -->
        <section class="relatorioSecao">
            <h3 class="relatorioSubtitulo">Totais dos itens do evento</h3>
            <div class="relatorioBox relatorioItensBox">
                <div v-for="item in itensTotais" :key="item.nome" class="relatorioItemLinha">
                    <img :src="item.foto" :alt="item.nome" class="relatorioItemFoto" />
                    <div class="relatorioItemInfo">
                        <div class="relatorioItemNome">{{ item.nome }}</div>
                        <div class="relatorioItemQtd">Total: {{ item.quantidade }}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'

const toast = useToast()

// MOCK: substitua pelo request da API quando houver
const relatorioEvento = ref({
    eventosDisponiveis: [
        { id: 1, nome: "Café da Manhã - 12/04" },
        { id: 2, nome: "Almoço - 12/04" },
        { id: 3, nome: "Jantar - 12/04" }
    ],
    eventoSelecionado: 1,
    itensPorEvento: {
        1: [
            { nome: "Bolo de cenoura", quantidade: 24, foto: "/mock/bolo-cenoura.jpg" },
            { nome: "Misto quente", quantidade: 12, foto: "/mock/misto-quente.jpg" },
            { nome: "Pão francês", quantidade: 40, foto: "/mock/pao-frances.jpg" },
            { nome: "Achocolatado", quantidade: 14, foto: "/mock/achocolatado.jpg" },
            { nome: "Café", quantidade: 28, foto: "/mock/cafe.jpg" }
        ],
        2: [
            { nome: "Arroz", quantidade: 36, foto: "/mock/arroz.jpg" },
            { nome: "Feijão", quantidade: 30, foto: "/mock/feijao.jpg" },
            { nome: "Frango grelhado", quantidade: 21, foto: "/mock/frango.jpg" },
        ],
        3: [
            { nome: "Sopa", quantidade: 20, foto: "/mock/sopa.jpg" }
        ]
    }
});

const eventoSelecionado = ref(relatorioEvento.value.eventoSelecionado)

const eventosDisponiveis = computed(() => relatorioEvento.value.eventosDisponiveis)
const itensTotais = computed(() => relatorioEvento.value.itensPorEvento[eventoSelecionado.value] ?? [])

function baixarRelatorio() {
    // Adapte para gerar CSV/PDF, aqui só exemplo de toast
    toast.info("Função de download ainda não implementada.");
}
</script>

<style scoped>
.paginaRelatorioEvento {
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    color: #27272a;
}

.relatorioCabecalho {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 10px 0;
}

.relatorioTitulo {
    font-size: 18px;
    font-weight: 700;
}

.relatorioDownload {
    border: none;
    background: #f8a953;
    border-radius: 12px;
    width: 48px;
    height: 48px;
    color: white;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.divBotaoVoltar {
    margin: 0px 15px 20px 0px;
}

.relatorioDownload:hover {
    background: #ffa948;
}

.relatorioSelecaoEvento {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    padding-left: 2px;
}

.relatorioSelecaoEvento label {
    font-size: 16px;
    font-weight: 700;
}

.relatorioSelecaoEvento select {
    border-radius: 8px;
    padding: 7px 16px;
    border: 1px solid #dddde3;
    font-size: 14px;
}

.relatorioSecao {
    margin-bottom: 32px;
}

.relatorioSubtitulo {
    font-size: 16px;
    font-weight: 600;
    margin: 18px 0 10px 4px;
}

.relatorioBox {
    border-radius: 16px;
    border: 1px solid #dddde3;
    padding: 18px 24px;
}

.relatorioItensBox {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.relatorioItemLinha {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 9px 0;
    border-bottom: 1px solid #f2f2f2;
}

.relatorioItemLinha:last-child {
    border-bottom: none;
}

.relatorioItemFoto {
    width: 74px;
    height: 66px;
    object-fit: cover;
    border-radius: 8px;
    background: #eee;
}

.relatorioItemInfo {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.relatorioItemNome {
    font-weight: 700;
    font-size: 16px;
}

.relatorioItemQtd {
    font-size: 14px;
}

@media (min-width: 765px) {
    .paginaRelatorioEvento {
        max-width: 820px;
        padding: 48px 0 64px 0;
    }

    .relatorioCabecalho {
        padding-left: 22px;
    }

    .relatorioTitulo {
        font-size: 28px;
    }

    .relatorioBox {
        padding: 32px 32px 20px 32px;
        font-size: 17px;
    }

    .relatorioItensBox {
        gap: 22px;
    }

    .relatorioItemFoto {
        width: 72px;
        height: 72px;
    }
}
</style>
