<template>
  <div class="paginaComanda">
    <div class="comandaCabecalho">
      <BotaoVoltar destino="/admin/pedidos" textPage="Comanda do Dia" />
      <button class="comandaPrint" @click="imprimirComanda" title="Imprimir">
        <span class="mdi mdi-printer"></span>
      </button>
    </div>

    <div v-if="isLoading" class="carregando">
      <p>Carregando comanda do dia...</p>
    </div>
    <div v-else-if="erroApi" class="erro">
      <p>{{ erroApi }}</p>
    </div>
    <div v-else-if="relatorioDeEventos.length > 0" class="containerEventos">
      <section v-for="evento in relatorioDeEventos" :key="evento.id_evento" class="comandaSecao">
        <h3 class="comandaSubtitulo">{{ evento.nome_evento }}</h3>
        <div class="comandaBox itensBox">
          <div v-for="item in evento.itens" :key="item.id_item" class="comandaItemLinha">
            <img :src="item.foto_item" :alt="item.nome_item" class="comandaItemFoto" v-if="item.foto_item" />
            <div class="comandaItemInfo">
              <div class="comandaItemNome">{{ item.nome_item }}</div>
            </div>
            <div class="comandaItemQtd">Total: {{ item.quantidade_total }}</div>
          </div>
        </div>
      </section>
    </div>
    <div v-else class="sem-itens">
      <p>Nenhum pedido encontrado para os eventos de hoje.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue';
import EventoService from '@/services/EventoService';

const relatorioDeEventos = ref([]);
const isLoading = ref(true);
const erroApi = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    erroApi.value = null;
    const response = await EventoService.relatorioItensEventosHoje();
    
    // A resposta da API já vem no formato { mensagem, data: [...] }
    // O serviço já extrai e retorna o array 'data'.
    relatorioDeEventos.value = response;

  } catch (error) {
    console.error('Erro ao buscar relatório de itens:', error);
    erroApi.value = "Falha ao carregar a comanda. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
});

function imprimirComanda() {
  window.print();
}
</script>

<style scoped>
.paginaComanda { max-width: 820px; margin: 0 auto; padding: 24px 16px; }
.comandaCabecalho { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.comandaPrint { border: none; background: #f8a953; border-radius: 12px; width: 48px; height: 48px; color: white; font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.containerEventos { display: flex; flex-direction: column; gap: 32px; }
.comandaSecao { margin-bottom: 0; }
.comandaSubtitulo { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #333; }
.comandaBox { border-radius: 16px; border: 1px solid #dddde3; padding: 16px 24px; }
.itensBox { display: flex; flex-direction: column; }
.comandaItemLinha { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
.comandaItemLinha:last-child { border-bottom: none; }
.comandaItemFoto { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; background-color: #f0f0f0; }
.comandaItemInfo { flex-grow: 1; }
.comandaItemNome { font-weight: 600; font-size: 16px; }
.comandaItemQtd { font-size: 16px; font-weight: bold; color: #333; }
.carregando, .erro, .sem-itens { text-align: center; padding: 40px; color: #777; font-size: 16px; font-weight: 500; }
</style>