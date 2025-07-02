<template>
  <div class="selecaoHorario">
    <h3>Selecione o Horário</h3>
    <p class="subtituloHorario">Escolha um dos horários disponíveis para a entrega</p>
    <div class="horariosDisponiveis">
      <button v-for="horarioObj in horarios" :key="horarioObj.id_horario"
        :class="{ selecionado: horarioSelecionado && horarioSelecionado.id_horario === horarioObj.id_horario }"
        @click="emit('update:horarioSelecionado', horarioObj)">
        {{ horarioObj.horario }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  horarios: {
    type: Array,
    default: () => [],
  },
  horarioSelecionado: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:horarioSelecionado']);
</script>

<style scoped>
.selecaoHorario {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}
.selecaoHorario h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}
.subtituloHorario {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
}
.horariosDisponiveis {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.horariosDisponiveis button {
  all: unset;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.horariosDisponiveis button.selecionado {
  background: #f8a953;
  border-color: #f8a953;
  color: white;
}
</style>
