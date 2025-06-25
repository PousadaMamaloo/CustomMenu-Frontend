<template>
  <div class="card-base" @click="$emit('click', id)">
    <div class="card-icone">
      <span class="mdi mdi-receipt-text-outline"></span>
    </div>
    <div class="card-conteudo">
      <span class="card-titulo">{{ nome || `Pedido - Quarto ${quarto}` }}</span>
      <div class="card-meta">
        <span v-if="data">{{ data }}</span>
        <span class="mdi mdi-circle-small" v-if="data && horario"></span>
        <span v-if="horario">{{ horario }}</span>
      </div>
    </div>
    <div class="card-acoes">
      <slot name="acoes"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  quarto: { type: [String, Number] },
  nome: { type: String, default: '' },
  horario: { type: String, default: '' },
  data: { type: String, default: '' },
});

// O evento de clique principal agora é emitido pelo card inteiro
defineEmits(['click']);
</script>

<style scoped>
/* Estilos genéricos para o card */
.card-base { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  padding: 16px; 
  background: #fff; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
}
.card-icone { 
  font-size: 24px; 
  color: #f8a953; 
}
.card-conteudo { 
  flex-grow: 1; 
}
.card-titulo { 
  font-weight: bold; 
  font-size: 16px; 
  color: #1a202c; 
}
.card-meta { 
  display: flex; 
  align-items: center; 
  gap: 4px; 
  font-size: 14px; 
  color: #718096; 
  margin-top: 4px;
}
.card-acoes { 
  margin-left: auto; 
}
</style>