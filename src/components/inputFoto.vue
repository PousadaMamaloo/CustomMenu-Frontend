<template>
  <div class="colunaImagem">
    <label class="tituloInput">{{ labelInputFoto }}</label>
    <input id="inputFotos" type="file" ref="inputArquivo" @change="escolherArquivo" accept="image/*"
      style="display: none" />

    <div class="campoInputImagem">
      <div v-if="!previewUrl" @click="abrirArquivoImagem">
        <span class="iconeImagemInput mdi mdi-image"></span>
      </div>
      <div class="imagemWrapper" v-else>
        <img :src="previewUrl" alt="Pré-visualização" class="preVisualizacaoImagem" />
        <button type="button" class="botaoExcluirImagem" @click.stop.prevent="editarArquivoImagem">
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

<style scoped>
.colunaImagem {
  display: flex;
  flex-direction: column;
}

.campoInputImagem {
  border-radius: 16px;
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

.preVisualizacaoImagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}

.botaoExcluirImagem {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #F6B100;
  border-radius: 6px;
  border: none;
  color: white;
  width: 23px;
  height: 23px;
  cursor: pointer;
}

.iconeEditar {
  font-size: 12px;
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
