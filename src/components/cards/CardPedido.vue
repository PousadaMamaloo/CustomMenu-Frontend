<template>
  <div class="card-historico">
    <div class="card-icone">
      <span class="mdi mdi-food-fork-drink"></span>
    </div>
    <div class="card-conteudo">
      <span class="card-titulo">Pedido - Quarto {{ quarto }}</span>
      <div class="card-meta">
        <span>{{ data }}</span>
        <span class="mdi mdi-circle-small"></span>
        <span>{{ horario }}</span>
        <span class="mdi mdi-circle-small"></span>
        <span>{{ totalItens }} itens</span>
      </div>
      <div class="card-status" :class="status.toLowerCase()">{{ status }}</div>
    </div>
    <div class="card-acoes">
      <button class="botao-acao" @click.stop="$emit('verMais', id)">Ver mais</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  quarto: { type: [String, Number], required: true },
  data: { type: String, default: '' },
  horario: { type: String, default: '' },
  totalItens: { type: Number, default: 0 },
  status: { type: String, default: 'DESCONHECIDO' }
});

// Declara os eventos que este componente pode emitir
defineEmits(['verMais', 'reaproveitar']);
</script>

<style scoped>
/* Seus estilos para o card aqui... */
.card-historico { display: flex; align-items: center; gap: 16px; padding: 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
.card-icone { font-size: 24px; color: #f8a953; }
.card-conteudo { flex-grow: 1; }
.card-titulo { font-weight: bold; font-size: 16px; color: #1a202c; }
.card-meta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #718096; margin: 4px 0; }
.card-status { display: inline-block; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; }
.card-status.entregue { background-color: #c6f6d5; color: #22543d; }
.card-status.cancelado { background-color: #fed7d7; color: #742a2a; }
.card-acoes { display: flex; flex-direction: column; gap: 8px; }
.botao-acao { width: 100px; padding: 6px 0; font-size: 12px; font-weight: bold; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; cursor: pointer; }
.botao-acao.principal { background-color: #f8a953; color: white; border-color: #f8a953; }
.botao-acao.desabilitado { background-color: #edf2f7; color: #a0aec0; border-color: #e2e8f0; cursor: not-allowed; }
</style>