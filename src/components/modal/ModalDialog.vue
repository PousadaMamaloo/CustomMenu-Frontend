<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modalState.visivel" class="modal-overlay" @click.self="fecharPeloFundo">
        <div class="modal-container">
          <div class="modal-conteudo">
            <!-- Ícone -->
            <div class="modal-icone">
              <img :src="modalState.icone" alt="Ícone do modal" />
            </div>

            <!-- Mensagem -->
            <div class="modal-mensagem">
              {{ modalState.mensagem }}
            </div>

            <!-- Botões -->
            <div class="modal-acoes">
              <!-- Botão primário (sempre presente) -->
              <BotaoSalvar v-if="modalState.acaoPrimaria" :carregando="modalState.acaoPrimaria.carregando || false"
                @click="executarAcaoPrimaria" />


              <!-- Botão secundário (opcional) -->
              <button v-if="modalState.acaoSecundaria" class="botao-secundario" @click="executarAcaoSecundaria">
                {{ modalState.acaoSecundaria.texto }}
              </button>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import BotaoSalvar from '../botaoSalvar.vue';

// Props para receber o estado do modal e funções de controle
const props = defineProps({
  modalState: {
    type: Object,
    required: true
  },
  fecharModal: {
    type: Function,
    required: true
  }
});

// Função para executar a ação primária
function executarAcaoPrimaria() {
  if (props.modalState.acaoPrimaria && props.modalState.acaoPrimaria.acao) {
    props.modalState.acaoPrimaria.acao();
  }
}

// Função para executar a ação secundária
function executarAcaoSecundaria() {
  if (props.modalState.acaoSecundaria && props.modalState.acaoSecundaria.acao) {
    props.modalState.acaoSecundaria.acao();
  }
}

// Fechar modal ao clicar no fundo (overlay)
function fecharPeloFundo(event) {
  // Verificar se clicou realmente no overlay e não em algum elemento dentro dele
  if (event.target === event.currentTarget) {
    props.fecharModal();
  }
}

// Adicionar listener para tecla ESC
function handleEscKeyPress(event) {
  if (event.key === 'Escape' && props.modalState.visivel) {
    props.fecharModal();
  }
}

// Adicionar e remover eventos de teclado
onMounted(() => {
  document.addEventListener('keydown', handleEscKeyPress);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKeyPress);
});
</script>

<style scoped>
/* Overlay do modal (fundo escurecido) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Container principal do modal */
.modal-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  padding: 0;
  overflow: hidden;
}

/* Conteúdo interno do modal */
.modal-conteudo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  text-align: center;
}

/* Estilo para o ícone */
.modal-icone {
  margin-bottom: 16px;
}

.modal-icone img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* Estilo para a mensagem */
.modal-mensagem {
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Área dos botões */
.modal-acoes {
  display: flex;
  flex-direction: column;
  width: 80%;
  gap: 12px;
}

/* Botão primário */
.botao-primario {
  background-color: #FFA033;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
}

.botao-primario:hover {
  background-color: #FF8C00;
}

/* Botão secundário (estilo de link) */
.botao-secundario {
  background-color: transparent;
  color: #666;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  width: 100%;
}

.botao-secundario:hover {
  color: #333;
  text-decoration: underline;
}

/* Animações de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>