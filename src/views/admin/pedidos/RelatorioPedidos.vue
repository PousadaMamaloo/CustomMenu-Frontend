<template>
    <div class="paginaRelatorioPedido">
        <!-- Cabeçalho -->
        <div class="relatorioCabecalho">
            <button class="relatorioVoltar" @click="voltar">
                <span class="mdi mdi-chevron-left"></span>
            </button>
            <h2 class="relatorioTitulo">Pedido quarto {{ pedido.quarto }}</h2>
        </div>

        <!-- Informações Gerais -->
        <section class="relatorioSecao">
            <h3 class="relatorioSubtitulo">Informações gerais</h3>
            <div class="relatorioBox relatorioInfoBox">
                <div class="relatorioInfoLinha">
                    <span class="relatorioInfoLabel">Pedido realizado em:</span>
                    <span class="relatorioInfoValor">{{ pedido.dataPedido }}</span>
                </div>
                <div class="relatorioInfoLinha">
                    <span class="relatorioInfoLabel">Horário escolhido</span>
                    <span class="relatorioInfoValor">{{ pedido.horarioEscolhido }}</span>
                </div>
            </div>
        </section>

        <!-- Itens do Pedido -->
        <section class="relatorioSecao">
            <h3 class="relatorioSubtitulo">Informações do pedido</h3>
            <div class="relatorioBox relatorioItensBox">
                <div v-for="item in pedido.itens" :key="item.nome" class="relatorioItemLinha">
                    <img :src="item.foto" :alt="item.nome" class="relatorioItemFoto" />
                    <div class="relatorioItemInfo">
                        <div class="relatorioItemNome">{{ item.nome }}</div>
                        <div class="relatorioItemQtd">Quantidade: {{ item.quantidade }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Observações -->
        <section class="relatorioSecao">
            <h3 class="relatorioSubtitulo">Observações do pedido</h3>
            <div class="relatorioBox relatorioObsBox">
                {{ pedido.observacoes }}
            </div>
        </section>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Simule recebendo via props ou pinia, aqui é local:
const pedido = {
    quarto: 1,
    dataPedido: '20/04/2020, 04:20',
    horarioEscolhido: '9:30',
    itens: [
        {
            foto: '/mock/bolo-cenoura.jpg',
            nome: 'Bolo de cenoura',
            quantidade: 2
        },
        {
            foto: '/mock/misto-quente.jpg',
            nome: 'Misto quente',
            quantidade: 1
        },
        {
            foto: '/mock/pao-frances.jpg',
            nome: 'Pão francês',
            quantidade: 3
        },
        {
            foto: '/mock/achocolatado.jpg',
            nome: 'Achocolatado',
            quantidade: 1
        },
        {
            foto: '/mock/cafe.jpg',
            nome: 'Café',
            quantidade: 2
        }
    ],
    observacoes:
        'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
}

function voltar() {
    router.back()
}
</script>

<style scoped>
.paginaRelatorioPedido {
    padding: 20px 0 40px 0;
    max-width: 420px;
    margin: 0 auto;
    font-family: 'Urbanist', sans-serif;
}

.relatorioCabecalho {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    padding-left: 8px;
    gap: 6px;
}

.relatorioVoltar {
    border: none;
    background: none;
    font-size: 28px;
    cursor: pointer;
    color: #444;
    padding: 0 4px 0 0;
}

.relatorioTitulo {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #1c1c1c;
}

.relatorioSecao {
    padding-inline: 20px;
}

.relatorioSubtitulo {
    font-size: 16px;
    font-weight: 500;
    margin: 18px 0 10px 4px;
    color: #232323;
}

.relatorioBox {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 0px 0px 0 #00000007;
    border: 1px solid #dddde3;
    padding: 14px 14px 14px 14px;
}

.relatorioInfoBox {
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-size: 15px;
}

.relatorioInfoLinha {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
}

.relatorioInfoLabel {
    color: #222;
    font-weight: 400;
}

.relatorioInfoValor {
    font-weight: 700;
    color: #222;
}

.relatorioItensBox {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;
}

.relatorioItemLinha {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #f2f2f2;
}

.relatorioItemLinha:last-child {
    border-bottom: none;
}

.relatorioItemFoto {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    background: #eee;
}

.relatorioItemInfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.relatorioItemNome {
    font-weight: 700;
    font-size: 15px;
    color: #222;
}

.relatorioItemQtd {
    font-size: 13px;
    color: #5d5d5d;
}

.relatorioObsBox {
    font-size: 14px;
    color: #4d4d4d;
    min-height: 52px;
    padding: 14px 10px;
    margin-bottom: 20px;
}

@media (min-width: 765px) {
    .paginaRelatorioPedido {
        max-width: 820px;
        padding: 48px 0 64px 0;
    }

    .relatorioCabecalho {
        padding-left: 48px;
        margin-bottom: 18px;
    }

    .relatorioTitulo {
        font-size: 26px;
    }

    .relatorioSecao {
        margin-bottom: 28px;
    }

    .relatorioBox {
        padding: 24px 24px 18px 24px;
        font-size: 17px;
    }

    .relatorioItensBox {
        gap: 20px;
    }

    .relatorioItemFoto {
        width: 70px;
        height: 70px;
    }

    .relatorioObsBox {
        font-size: 16px;
        min-height: 62px;
        padding: 16px 18px;
        margin-bottom: 36px;
    }
}
</style>
