<template>
    <div class="paginaComanda">
        <div class="comandaCabecalho">
            <BotaoVoltar destino="/admin/pedidos" textPage="Comanda Geral de Itens" />
            <button class="comandaPrint" @click="imprimirComanda" title="Imprimir">
                <span class="mdi mdi-printer"></span>
            </button>
        </div>

        <section class="comandaSecao">
            <h3 class="comandaSubtitulo">Itens consolidados de todos os pedidos</h3>
            <div class="comandaBox">
                <div v-if="itensAgregados.length > 0" class="comandaItensBox">
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
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}
.comandaCabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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
.comandaSecao {
  margin-bottom: 20px;
}
.comandaSubtitulo {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
}
.comandaBox {
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}
.comandaItensBox {
  display: flex;
  flex-direction: column;
}
.comandaItemLinha {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.comandaItemLinha:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.comandaItemLinha:first-child {
  padding-top: 0;
}
.comandaItemFoto {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #e9e9e9;
}
.comandaItemInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}
.comandaItemNome {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
.comandaItemQtd {
  font-size: 14px;
  font-weight: 500;
  color: #777;
}
.sem-itens {
  text-align: center;
  padding: 40px;
  color: #777;
}
</style>