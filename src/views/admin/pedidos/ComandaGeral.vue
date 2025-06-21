<template>
    <div class="paginaComanda">
        <div class="comandaCabecalho">
            <BotaoVoltar destino="/admin/pedidos" textPage="Comanda Geral de Itens" />
            <button class="comandaPrint" @click="imprimirComanda">
                <span class="mdi mdi-printer"></span>
            </button>
        </div>

        <section class="comandaSecao">
            <div class="comandaBox">
                <div v-if="itensAgregados.length > 0">
                    <div v-for="item in itensAgregados" :key="item.nome" class="comandaItemLinha">
                        <img :src="item.foto" :alt="item.nome" class="comandaItemFoto" />
                        <div class="comandaItemInfo">
                            <div class="comandaItemNome">{{ item.nome }}</div>
                            <div class="comandaItemQtd">Total Pedido: {{ item.quantidade }}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="sem-itens">
                    <p>Nenhum item pedido encontrado.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'

const todosOsPedidos = ref([
    { id: 1, quarto: 1, itens: [{ nome: 'Misto quente', quantidade: 1, foto: '/mock/misto-quente.jpg' }, { nome: 'Suco de laranja', quantidade: 1, foto: '/mock/suco.jpg' }] },
    { id: 2, quarto: 6, itens: [{ nome: 'Café', quantidade: 2, foto: '/mock/cafe.jpg' }] },
    { id: 3, quarto: 2, itens: [{ nome: 'Misto quente', quantidade: 1, foto: '/mock/misto-quente.jpg' }, { nome: 'Pão francês', quantidade: 2, foto: '/mock/pao-frances.jpg' }] },
    { id: 4, quarto: 9, itens: [{ nome: 'Suco de laranja', quantidade: 1, foto: '/mock/suco.jpg' }] },
]);

const itensAgregados = computed(() => {
    const totais = {};

    todosOsPedidos.value.forEach(pedido => {
        pedido.itens.forEach(item => {
            if (totais[item.nome]) {
                totais[item.nome].quantidade += item.quantidade;
            } else {
                totais[item.nome] = { ...item };
            }
        });
    });

    return Object.values(totais).sort((a, b) => a.nome.localeCompare(b.nome));
});

function imprimirComanda() {
    window.print();
}
</script>

<style scoped>
.paginaComanda {
    max-width: 820px;
    margin: 0 auto;
    padding: 24px 16px;
}
.comandaCabecalho {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}
.comandaPrint {
    border: none;
    background: #f8a953;
    border-radius: 12px;
    width: 48px;
    height: 48px;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.comandaBox {
    border-radius: 16px;
    border: 1px solid #dddde3;
    padding: 18px 24px;
}
.comandaItemLinha {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 0;
    border-bottom: 1px solid #f2f2f2;
}
.comandaItemLinha:last-child {
    border-bottom: none;
}
.comandaItemFoto {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 8px;
    background: #eee;
}
.comandaItemInfo {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.comandaItemNome {
    font-weight: 700;
    font-size: 18px;
}
.comandaItemQtd {
    font-size: 16px;
    font-weight: 500;
    color: #555;
}
.sem-itens {
    text-align: center;
    padding: 40px;
    color: #777;
}
</style>