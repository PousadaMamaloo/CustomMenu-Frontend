<template>
  <botaoVoltar @click="voltarParaQuartos" />
  <form @submit.prevent="salvarQuarto">  
    <div class="divPrincipal">     
      <div class="caixaFoto">
            <InputFoto 
              v-model="fotoQuarto"
              label="Foto do Quarto"
              @file-selected="handleFile"
            />
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
    <div class="areaBotoes">
      <BotaoSalvar @click="salvarQuarto" />
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import BotaoVoltar from '../../../components/botoes/botaoVoltar.vue';

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

.hintErroInput {
  color: #DC363C;
  font-size: 12px;
  margin-top: -20px;
	margin-bottom: 4px;
}
</style>