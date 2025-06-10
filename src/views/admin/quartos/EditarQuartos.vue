<template>
	<!-- Substituir por componente -->
	<BotaoVoltar destino="quarto" textPage="Editar Quarto" />

	<form @submit.prevent="salvarQuarto">
		<div class="formularioQuarto">
			<div>
				<InputFoto v-model="fotoQuarto" label="Foto do Quarto" @file-selected="handleFile" />
			</div>
			<div class="colunaCampos">
				<label class="tituloInput">Nome do quarto</label>
				<input v-model="form.nomeQuarto" class="inputDado" type="text" @input="limparErro('nomeQuarto')" />
				<p v-if="erros.nomeQuarto" class="hintErroInput">{{ erros.nomeQuarto }}</p>

				<label class="tituloInput">Quantidade de hóspedes</label>
				<input class="inputDado" v-model="form.inputQuantidadeHospedes"
					@change="limparErro('inputQuantidadeHospedes')" type="number">
				</input>
				<p v-if="erros.inputQuantidadeHospedes" class="hintErroInput">{{ erros.inputQuantidadeHospedes }}</p>

				<label class="tituloInput">Data de hospedagem</label>
				<div class="dataHospedagem">
					<div>
						<label class="tituloInputDado">Data entrada</label>
						<input v-model="form.dataEntrada" v-mask="'##/##/####'" placeholder="DD/MM/AAAA"
							class="inputDado" @input="aplicaMascara && limparErro('dataEntrada')"></input>
						<p v-if="erros.dataEntrada" class="hintErroInput">{{ erros.dataEntrada }}</p>
					</div>
					<div>
						<label class="tituloInputDado">Data saída</label>
						<input v-model="form.dataSaida" v-mask="'##/##/####'" placeholder="DD/MM/AAAA" class="inputDado"
							@input="aplicaMascara && limparErro('dataSaida')" />
						<p v-if="erros.dataSaida" class="hintErroInput">{{ erros.dataSaida }}</p>
					</div>
				</div>
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

import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoSalvar from '../../../components/botoes/botaoSalvar.vue';

// implementar com componente de sair (dialog)
// const dialogVisible = ref(false)

// function abrirDialogVoltar() {
//   dialogVisible.value = true
// }

// function fecharDialog() {
//   dialogVisible.value = false
// }

// function confirmarSaida() {
//   fecharDialog()
//   console.log('Usuário confirmou saída da tela.')
// }

const inputValor = ref('')

const form = reactive({
	foto: '',
	nomeQuarto: '',
	inputQuantidadeHospedes: '',
	dataEntrada: '',
	dataSaida: ''
});

// Campos obrigatórios - erros
const erros = reactive({
	nomeQuarto: '',
	inputQuantidadeHospedes: '',
	dataEntrada: '',
	dataSaida: ''
});

// Aplica máscara
const aplicaMascara = (event) => {
	const value = event.target.value
	inputValor.value = value
}


// Limpa erros nos campos ao digitar
function limparErro(campo) {
	erros[campo] = '';
}

// Valida campos antes de salvar
function salvarQuarto() {
	// Limpa mensagens de erro anteriores
	erros.nomeQuarto = '';
	erros.inputQuantidadeHospedes = '';
	erros.dataEntrada = '';
	erros.dataSaida = '';

	let valido = true;

	if (!form.nomeQuarto.trim()) {
		erros.nomeQuarto = 'Nome do quarto é obrigatório.';
		valido = false;
	}

	if (!form.inputQuantidadeHospedes) {
		erros.inputQuantidadeHospedes = 'Selecione a quantidade de hóspedes.';
		valido = false;
	}

	if (!form.dataEntrada.trim()) {
		erros.dataEntrada = 'Data de entrada é obrigatória.';
		valido = false;
	}

	if (!form.dataSaida.trim()) {
		erros.dataSaida = 'Data de saída é obrigatória.';
		valido = false;
	}

	if (!valido) return;

	console.log('Formulário válido. Dados:', form);
}

</script>

<style>
.campoInputImagem {
	border: 1px solid #DDDDE3;
	border-radius: 30px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	text-align: center;
	font-size: 14px;
	overflow: hidden;
	transition: width 0.3s ease, height 0.3s ease;
	width: 129px;
	height: 129px;
}

.formularioQuarto {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
	flex-direction: row;
}

@media (max-width: 768px) {
	.formularioQuarto {
		flex-direction: column;
		align-items: center;
	}
}

.colunaCampos {
	display: flex;
	flex-direction: column;
}

.hintErroInput {
	color: #DC363C;
	font-size: 12px;
	margin-top: -20px;
	margin-bottom: 4px;
}

.dataHospedagem {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 8px;
}

.dataHospedagem>div {
	display: flex;
	flex-direction: column;
}

.inputDado {
	border: 1px solid #DDDDE3;
	border-radius: 16px;
	height: 36px;
	padding: 0px 10px 0px 10px !important;
	margin-bottom: 20px;
}

.tituloInput {
	font-size: 14px;
	font-weight: 550;
	margin-bottom: 8px;
}

.tituloInputDado {
	font-size: 12px;
	font-weight: 520;
	color: #78828A;
}
</style>
