<template>
  <div class="containerPagina">
    <botaoVoltar @click="voltarParaQuartos" />

    <form @submit.prevent="salvarQuarto">  
      <div class="conteudoFormulario">    
        <div class="colunaImagem"> 
          <div class="campoFoto">
            <p class="tituloInput">Foto do produto</p>
            <div class="caixaFoto">
                  <InputFoto 
                    v-model="fotoQuarto"
                    label="Foto do Quarto"
                    @file-selected="handleFile"
                  />
            </div>
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
      <div class="areaBotoes">
        <BotaoSalvar @click="salvarQuarto" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '../../../components/botoes/botaoVoltar.vue';

const form = reactive({
  foto: '',
  nomeQuarto: '',
  numeroQuarto: ''
});

const erros = reactive({
  nomeQuarto: '',
  numeroQuarto: '',
});


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

</style>