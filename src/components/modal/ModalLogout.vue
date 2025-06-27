<template>
  <div v-if="aberto" class="modal-overlay" @click.self="$emit('cancelar')">
    <div class="modal-conteudo">
      <h3 class="modal-titulo">Deseja mesmo realizar o Logout?</h3>
      <div class="modal-acoes">
        <button class="botao-modal botao-nao" @click="$emit('cancelar')">Não</button>
        <button class="botao-modal botao-sim" @click="$emit('confirmar')">Sim</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  aberto: {
    type: Boolean,
    required: true,
  }
});

defineEmits(['confirmar', 'cancelar']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-conteudo {
  background-color: white;
  padding: 24px 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 24px;
}

.modal-acoes {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.botao-modal {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  min-width: 100px;
  transition: opacity 0.2s;
}

.botao-modal:hover {
  opacity: 0.85;
}

.botao-sim {
  background-color: #28a745; /* Verde */
  color: white;
}

.botao-nao {
  background-color: #dc3545; /* Vermelho */
  color: white;
}
</style>