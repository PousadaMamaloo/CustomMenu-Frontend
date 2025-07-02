<template>
  <div class="acoes-pedido">
    <!-- Aviso de horário não permitido -->
    <div v-if="!dentroDoHorarioPermitido" class="aviso-horario">
      <span class="mdi mdi-clock-alert-outline"></span>
      <p>Pedidos só podem ser realizados ou editados das 10:00 às 22:00.</p>
    </div>

    <div class="botoes-container">
      <button v-if="editando" @click="$emit('excluir')" class="botao botao-excluir"
        :disabled="enviando || !dentroDoHorarioPermitido">
        <span class="mdi mdi-delete-outline"></span>
        {{ enviando ? 'Cancelando...' : 'Cancelar Pedido' }}
      </button>

      <button @click="$emit('enviar')" class="botao botao-enviar"
        :disabled="!podeEnviar || enviando || !dentroDoHorarioPermitido">
        <span class="mdi mdi-send-outline"></span>
        {{ enviando ? 'Enviando...' : (editando ? 'Atualizar Pedido' : 'Enviar Pedido') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  enviando: { type: Boolean, default: false },
  editando: { type: Boolean, default: false },
  podeEnviar: { type: Boolean, default: false }
});

defineEmits(['enviar', 'excluir']);

// Verificar se está dentro do horário permitido (das 10h às 22h)
const dentroDoHorarioPermitido = computed(() => {
  const agora = new Date();
  const horaAtual = agora.getHours();
  return horaAtual >= 10 && horaAtual < 22;
});
</script>

<style scoped>
.acoes-pedido {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aviso-horario {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 16px;
  color: #856404;
}

.aviso-horario .mdi {
  font-size: 24px;
  color: #f39c12;
}

.aviso-horario p {
  margin: 0;
  font-weight: 500;
  font-size: 14px;
}

.botoes-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.botao {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.botao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.botao-enviar {
  background: linear-gradient(135deg, #f8a953, #e8941a);
  color: white;
}

.botao-enviar:hover:not(:disabled) {
  background: linear-gradient(135deg, #e8941a, #d18516);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 169, 83, 0.4);
}

.botao-excluir {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.botao-excluir:hover:not(:disabled) {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

@media (max-width: 768px) {
  .botoes-container {
    flex-direction: column;
  }

  .botao {
    width: 100%;
  }
}
</style>
