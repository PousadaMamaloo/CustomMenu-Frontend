<template>
    <button class="voltarParaQuartos">
			<span class="iconeVoltar mdi mdi-chevron-left"></span>
			<p>Quarto x</p>
		</button>
		<form @submit.prevent="salvarQuarto">       
			<div class="formularioQuarto">
				<div class="coluna1">
					<label class="tituloInput">Foto do quarto</label>
					<input
						id="inputFotos"
						type="file"
						ref="fileInput"
						@change="handleFileChange"
						accept="image/*"
						style="display: none"
					/>
					<div class="divExemplo" @click="openFilePicker">
						<img
							v-if="previewUrl"
							:src="previewUrl"
							alt="Pré-visualização"
							class="preview-img"
						/>
						<span v-else>Clique aqui para selecionar a foto</span>
					</div>
				</div>
				<div class="coluna2">

					<label class="tituloInput">Nome do quarto</label>
					<input v-model="form.nomeQuarto" class="inputData" type="text" />

					<label class="tituloInput">Quantidade de hóspedes</label>
					<select class="inputData" v-model="form.selectQuantidadeHospedes">
						<option disabled value="">Selecione a quantidade de hóspedes</option>
						<option>0</option>
						<option>1</option>
						<option>2</option>
					</select>

					<label class="tituloInput">Data de hospedagem</label>
					<div class="dataHospedagem">
						<div>
							<label class="tituloInputData">Data entrada</label>
							<input
								v-model="form.dataEntrada" 
								v-mask="'##/##/####'"
								placeholder="DD/MM/AAAA" 
								class="inputData" 
								@input="applyMask"
							></input>
						</div>
						<div>
							<label class="tituloInputData">Data saída</label>
							<input 
								v-model="form.dataSaida" 
								v-mask="'##/##/####'" 
								placeholder="DD/MM/AAAA" 
								class="inputData" 
								@input="applyMask"
							/>
						</div>
					</div>
				</div>
			</div>
			<button class="greenButtonContainer" type="submit">
				<p class="greenLegendButtonContainer">Salvar</p>
			</button>
		</form>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue';

const previewUrl = ref(null);
const fileInput = ref(null);
const inputValue = ref('')

const form = reactive({
  foto: '',
  nomeQuarto: '',
  selectQuantidadeHospedes: '',
  dataEntrada: '',
	dataSaida: ''
});

const applyMask = (event) => {
  const value = event.target.value
  inputValue.value = value
}

function openFilePicker() {
  fileInput.value?.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
}

// 
function salvarQuarto() {
  if (
    !form.nomeQuarto.trim() ||
    !form.selectQuantidadeHospedes ||
    !form.dataEntrada.trim() ||
    !form.dataSaida.trim()
  ) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  console.log('Formulário válido. Dados:', form);
}

</script>

<style>

.divExemplo {
  border: 1px solid #DDDDE3;
	border-radius: 16px;
  width: 123px;
  height: 123px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f9f9f9;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  transition: width 0.3s ease, height 0.3s ease;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .divExemplo {
    width: 200px;
    height: 200px;
  }
}

@media (min-width: 1024px) {
  .divExemplo {
    width: 308px;
    height: 308px;
  }
}


.voltarParaQuartos {
	display: flex;
	align-items: center;
	background: transparent;
  border: none;
  outline: none; 
  color: inherit;
  cursor: pointer; 
}

.iconeVoltar {
	font-size: 25px;
}

.voltarParaQuartos > p {
	font-weight: 600;
	font-size: 18px;
}

.formularioQuarto {
	display: flex;
	margin: 30px;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 20px;
}

.coluna1{
	display: flex;
	flex-direction: column;
}

.coluna2{
	display: flex;
	flex-direction: column;
}

.dataHospedagem {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 8px;
}

.dataHospedagem > div {
	display: flex;
	flex-direction: column;
}

.inputData {
	border: 1px solid #DDDDE3;
	border-radius: 16px;
	height: 34px;
	padding-left: 10px;
	padding-right: 10px;
	margin-bottom: 20px;
}

.tituloInput {
	font-size: 14px;
	font-weight: 550;
	margin-bottom: 8px;
}

.tituloInputData {
	font-size: 12px;
	font-weight: 520;
	color: #78828A;
}
</style>