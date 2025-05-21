<template>
  <div class="colunaImagem">
    <label class="tituloInput">{{ labelInputFoto }}</label>
    <input
      id="inputFotos"
      type="file"
      ref="inputArquivo"
      @change="escolherArquivo"
      accept="image/*"
      style="display: none"
    />

    <div class="campoInputImagem">
      <div v-if="!previewUrl" @click="abrirArquivoImagem">
        <span class="iconeImagemInput mdi mdi-image"></span>
      </div>
      <div class="imagemWrapper" v-else>
        <img
          :src="previewUrl"
          alt="Pré-visualização"
          class="preVisualizacaoImagem"
        />
        <button
          type="button"
          class="botaoExcluirImagem"
          @click.stop.prevent="editarArquivoImagem"
        >
          <span class="iconeEditar mdi mdi-pencil-outline"></span>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: File,
  label: { type: String, default: 'Foto' },
})

const emit = defineEmits(['update:modelValue', 'file-selected'])


const previewUrl = ref(null);
const inputArquivo = ref(null);

function abrirArquivoImagem() {
  inputArquivo.value.value = null;
  inputArquivo.value?.click();
}

function editarArquivoImagem() {
  inputArquivo.value.value = null; // limpa o valor anterior
  inputArquivo.value?.click();
}


function escolherArquivo(event) {
  const file = event.target.files[0];
  if (file) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value); // libera a URL anterior da memória
    }
    previewUrl.value = URL.createObjectURL(file);
  }
}
</script>

<style>

.colunaImagem{
	display: flex;
	flex-direction: column;
}

@media (min-width: 768px) {
  .campoInputImagem {
    width: 200px;
    height: 200px;
  }
}

@media (min-width: 1024px) {
  .campoInputImagem {
    width: 308px;
    height: 308px;
  }
}


.preVisualizacaoImagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.botaoExcluirImagem {
  position: absolute; 
  bottom: 20px; 
  right: 20px; 
  background-color: #F6B100; 
  border-radius: 8px;
  border: none;
  color: white;
  width: 42px;
  height: 42px;
  padding: 5px;
  cursor: pointer;
  z-index: 10; 
}

.iconeEditar {
  font-size: 16px;
}

.imagemWrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.iconeImagemInput {
	font-size: 60px;
	color: #ced0d1;
}

</style>