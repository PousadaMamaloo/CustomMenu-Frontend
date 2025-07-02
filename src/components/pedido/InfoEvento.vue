<template>
  <div class="infoEvento">
    <h2>{{ evento.nome_evento }}</h2>
    <p v-if="evento.desc_evento">{{ evento.desc_evento }}</p>
    <div class="dataEvento">
      <i class="mdi mdi-calendar"></i>
      {{ dataAtual }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  evento: {
    type: Object,
    required: true,
  },
  dataAtual: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.infoEvento {
  background: linear-gradient(135deg, #f8a953, #d48946);
  color: white;
  padding: 24px;
  border-radius: 16px;
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
</style>
