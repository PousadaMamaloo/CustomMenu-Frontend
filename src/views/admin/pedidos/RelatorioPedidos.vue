<template>
  <div class="paginaRelatorioPedido">
    <div class="relatorioCabecalho">
      <button class="relatorioVoltar" @click="voltar">
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <h2 v-if="pedido" class="relatorioTitulo">Pedido quarto {{ pedido.quarto }}</h2>
    </div>

    <div v-if="pedido">
      <section class="relatorioSecao">
        <h3 class="relatorioSubtitulo">Informações gerais</h3>
        <div class="relatorioBox relatorioInfoBox">
          <div class="relatorioInfoLinha">
            <span class="relatorioInfoLabel">Pedido realizado em:</span>
            <span class="relatorioInfoValor">{{ formatarDataHora(pedido.horarioPedido) }}</span>
          </div>
          <div class="relatorioInfoLinha">
            <span class="relatorioInfoLabel">Horário escolhido:</span>
            <span class="relatorioInfoValor">{{ pedido.horarioEntrega }}</span>
          </div>
        </div>
      </section>

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

      <section v-if="pedido.observacoes" class="relatorioSecao">
        <h3 class="relatorioSubtitulo">Observações do pedido</h3>
        <div class="relatorioBox relatorioObsBox">
          {{ pedido.observacoes }}
        </div>
      </section>
    </div>
    <div v-else class="carregando">
      <p>Sem pedidos para esse quarto!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const pedido = ref(null)

function formatarDataHora(dateTimeString) {
  if (!dateTimeString) return 'Data inválida';
  const date = new Date(dateTimeString);
  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

function buscarPedidoPorId(id) {
  const baseDePedidos = [
    { id: 1, quarto: 1, horarioPedido: '2025-06-20T04:20:00Z', horarioEntrega: '9:30', itens: [{ nome: 'Bolo de cenoura', quantidade: 2, foto: '/mock/bolo-cenoura.jpg' }, { nome: 'Misto quente', quantidade: 1, foto: '/mock/misto-quente.jpg' }, { nome: 'Pão francês', quantidade: 3, foto: '/mock/pao-frances.jpg' }], observacoes: 'Sem lactose, por favor.' },
    { id: 2, quarto: 6, horarioPedido: '2025-06-20T10:00:00Z', horarioEntrega: '10:30', itens: [{ nome: 'Suco de laranja', quantidade: 1, foto: '/mock/suco.jpg' }], observacoes: '' },
    { id: 3, quarto: 2, horarioPedido: '2025-06-20T08:00:00Z', horarioEntrega: '08:30', itens: [{ nome: 'Ovos Mexidos', quantidade: 1, foto: '/mock/ovos.jpg' }], observacoes: 'Bem passado.' },
  ];
  return baseDePedidos.find(p => p.id === parseInt(id));
}

onMounted(() => {
  const pedidoId = route.params.id;
  if (pedidoId) {
    pedido.value = buscarPedidoPorId(pedidoId)
  }
});

function voltar() {
  router.back()
}
</script>

<style scoped>
.paginaRelatorioPedido {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.relatorioCabecalho {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.relatorioVoltar {
  border: none;
  background: none;
  font-size: 24px;
  color: #555;
  cursor: pointer;
  margin-right: 10px;
}

.relatorioTitulo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.relatorioSecao {
  margin-bottom: 20px;
}

.relatorioSubtitulo {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
}

.relatorioBox {
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}

.relatorioInfoBox {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.relatorioInfoLinha {
  display: flex;
  justify-content: space-between;
}

.relatorioInfoLabel {
  color: #555;
}

.relatorioInfoValor {
  font-weight: bold;
  color: #333;
}

.relatorioItensBox {
  display: flex;
  flex-direction: column;
}

.relatorioItemLinha {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.relatorioItemLinha:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.relatorioItemLinha:first-child {
  padding-top: 0;
}

.relatorioItemFoto {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #e9e9e9;
}

.relatorioItemInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.relatorioItemNome {
  font-weight: bold;
  font-size: 15px;
  color: #333;
}

.relatorioItemQtd {
  font-size: 14px;
  color: #777;
}

.relatorioObsBox {
  font-size: 14px;
  color: #555;
  white-space: pre-wrap;
  line-height: 1.5;
}

.carregando {
  text-align: center;
  padding: 40px;
  color: #777;
}
</style>