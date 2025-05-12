<template>
  <button class="voltarParaQuartos" @click="abrirDialogVoltar">
    <span class="iconeVoltar mdi mdi-chevron-left"></span>
    <p>Quarto x</p>
  </button>
  <form @submit.prevent="salvarQuarto">  
    <div class="divPrincipal">     
      <div class="colunaImagem">
        <label class="tituloInput">Foto do quarto</label>
        <input
          id="inputFotos"
          type="file"
          ref="inputArquivo"
          @change="escolherArquivo"
          accept="image/*"
          style="display: none"
        />
        <div class="campoInputImagem" @click="abrirArquivoImagem">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="Pré-visualização"
            class="preVisualizacaoImagem"
          />
          <span v-else>
						<span class="iconeImagemInput mdi mdi-image"></span>
          </span>
        </div>
      </div>
      <div class="colunaCampos">
        <label class="tituloInput">Nome do quarto</label>
        <input
          v-model="form.nomeQuarto" 
          class="inputDadoCadastro" 
          type="text" 
          @input="limparErro('nomeQuarto')"
        />
        <p v-if="erros.nomeQuarto" class="hintErroInput">{{ erros.nomeQuarto }}</p>
      
        <label class="tituloInput">Número do quarto</label>
        <input
          v-model="form.numeroQuarto" 
          class="inputDadoCadastro" 
          type="number" 
          @input="limparErro('numeroQuarto')"
        />
        <p v-if="erros.numeroQuarto" class="hintErroInput">{{ erros.numeroQuarto }}</p>
      </div>
    </div>
    <button type="submit">
      <p>Salvar</p>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue';

const previewUrl = ref(null);
const inputArquivo = ref(null);

const form = reactive({
  foto: '',
  nomeQuarto: '',
  numeroQuarto: ''
});

const erros = reactive({
  nomeQuarto: '',
  numeroQuarto: '',
});

function abrirArquivoImagem() {
  inputArquivo.value?.click();
}

function escolherArquivo(event) {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
}

// Limpa erros nos campos ao digitar
function limparErro(campo) {
  erros[campo] = '';
}

// Valida campos antes de salvar
function salvarQuarto() {
  // Limpa mensagens de erro anteriores
  erros.nomeQuarto = '';
  erros.numeroQuarto = '';

  let valido = true;

  if (!form.nomeQuarto.trim()) {
    erros.nomeQuarto = 'Nome do quarto é obrigatório.';
    valido = false;
  }

  if (!form.numeroQuarto) {
    erros.numeroQuarto = 'Selecione o número do quarto.';
    valido = false;
  }

  if (!valido) return;

  console.log('Formulário válido. Dados:', form);
}

</script>

<style>


.divPrincipal {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
	flex-direction: row;
}

@media (max-width: 768px) {
  .divPrincipal {
    flex-direction: column;
    align-items: center; 
  }
}

.inputDadoCadastro {
	border: 1px solid #DDDDE3;
	border-radius: 16px;
	height: 36px;
  width: 270px;
	padding: 0px 10px 0px 10px !important;
  margin-bottom: 20px;
}

.tituloInput {
	font-size: 14px;
	font-weight: 550;
	margin-bottom: 8px;
}

.hintErroInput {
  color: #DC363C;
  font-size: 12px;
  margin-top: -20px;
	margin-bottom: 4px;
}
</style>