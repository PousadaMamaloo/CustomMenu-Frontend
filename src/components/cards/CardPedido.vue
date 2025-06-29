<template>
  <div class="card-pedido" @click="$emit('click', id)">
    <div class="card-conteudo-principal">
      <div class="card-cabecalho">
        <span class="mdi mdi-receipt-text-outline icone-principal"></span>
        <h4 class="card-titulo">{{ titulo }}</h4>
      </div>
      <div class="card-corpo">
        <div v-if="subtitulo" class="info-linha">
          <span class="mdi mdi-account-outline info-icone"></span>
          <span class="info-texto">{{ subtitulo }}</span>
        </div>
        <div v-if="horario" class="info-linha">
          <span class="mdi mdi-clock-time-four-outline info-icone"></span>
          <span class="info-texto">{{ horario }}</span>
        </div>
      </div>
    </div>
    <div class="card-acao-container">
      <slot name="acoes"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  horario: { type: String, default: '' },
});
defineEmits(['click']);
</script>

<style scoped>
.card-pedido {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.card-pedido:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.icone-principal { font-size: 22px; color: #f8a953; }
.card-conteudo-principal { flex-grow: 1; }
.card-cabecalho { display: flex; align-items: center; gap: 8px; }
.card-titulo { font-size: 16px; font-weight: 700; color: #1a202c; margin: 0; }
.card-corpo { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; padding-left: 30px; }
.info-linha { display: flex; align-items: center; gap: 6px; }
.info-icone { font-size: 16px; color: #a1a1aa; }
.info-texto { font-size: 14px; color: #52525b; }
.card-acao-container { margin-left: auto; }
</style>