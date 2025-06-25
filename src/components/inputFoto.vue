<template>
  <div class="input-foto-container">
    <input type="file" ref="inputArquivo" @change="onFileChange" accept="image/*" style="display: none" />

    <!-- Área clicável que mostra a imagem ou um ícone -->
    <div class="campoInputImagem" @click="triggerFileInput">
      <!-- Mostra a imagem se a prop 'imagemUrl' for fornecida -->
      <div v-if="imagemUrl" class="imagemWrapper">
        <img :src="imagemUrl" alt="Pré-visualização" class="preVisualizacaoImagem" />
        <button type="button" class="botaoEditarImagem" @click.stop="triggerFileInput">
          <span class="iconeEditar mdi mdi-pencil-outline"></span>
        </button>
      </div>
      <!-- Mostra um ícone se não houver imagem -->
      <div v-else class="placeholder-icon">
        <span class="iconeImagemInput mdi mdi-image"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Define as props que o componente aceita. Agora inclui 'imagemUrl'.
const props = defineProps({
  imagemUrl: {
    type: String,
    default: ''
  }
});

// Define o evento que será emitido para o componente pai.
const emit = defineEmits(['file-selected']);

const inputArquivo = ref(null);

// Função para acionar o clique no input de arquivo escondido.
function triggerFileInput() {
  inputArquivo.value?.click();
}

// Função que lida com a seleção de um novo arquivo.
function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Emite o arquivo selecionado para o componente pai.
    emit('file-selected', file);
  }
}
</script>

<style scoped>
.input-foto-container {
  display: flex;
  flex-direction: column;
}

.campoInputImagem {
  border: 2px dashed #ddd;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9;
  width: 100%;
  height: 100%;
  min-height: 150px;
}

@media (min-width: 768px) {
  .campoInputImagem {
    width: 130px;
    height: 130px;
  }
}

@media (min-width: 1024px) {
  .campoInputImagem {
    width: 308px;
    height: 308px;
  }
}

.imagemWrapper {
  width: 100%;
  height: 100%;
}

.preVisualizacaoImagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.iconeImagemInput {
  font-size: 60px;
  color: #ced0d1;
}

.botaoEditarImagem {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #F6B100;
  border-radius: 6px;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.iconeEditar {
  font-size: 16px;
}
</style>
