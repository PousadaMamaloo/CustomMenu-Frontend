<template>
	
	<div class="pagina-container">
		<BotaoVoltar destino="/admin/quarto" textPage="Editar Quarto" />
		
		<Loading v-if="carregando" />

		<form v-else @submit.prevent="salvarQuarto">
			<div class="formulario-quarto">
				<div class="coluna-campos">
					<div class="campo-grupo">
						<label class="tituloInput">Número do Quarto</label>
						<input v-model="form.num_quarto" class="inputDado" type="text" disabled />
						<p class="hint-info">O número do quarto não pode ser alterado.</p>
					</div>

					<div class="campo-grupo">
						<label class="tituloInput">Capacidade (Adultos)</label>
						<input v-model.number="form.capa_adultos" class="inputDado" type="number" min="1" />
						<p v-if="erros.capa_adultos" class="hintErroInput">{{ erros.capa_adultos }}</p>
					</div>

					<div class="campo-grupo">
						<label class="tituloInput">Capacidade (Crianças)</label>
						<input v-model.number="form.capa_criancas" class="inputDado" type="number" min="0" />
						<p v-if="erros.capa_criancas" class="hintErroInput">{{ erros.capa_criancas }}</p>
					</div>
				</div>
			</div>

			<div class="areaBotoes">
				<BotaoSalvar :disabled="carregando" />
				<button type="button" class="botao-excluir" @click="excluirQuarto" :disabled="carregando">
					Excluir Quarto
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import QuartoService from '@/services/QuartoService';
import Loading from '@/components/Loading.vue';
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Corrigido: Usando o parâmetro 'numero' da rota
const quartoNumero = route.params.numero;
const carregando = ref(true);

const form = ref({
	num_quarto: '',
	capa_adultos: 1,
	capa_criancas: 0,
	disponivel: true,
});

const erros = ref({});

onMounted(async () => {
	try {
		// A resposta da API agora contém o quarto dentro de uma propriedade 'data'
		const response = await QuartoService.buscarQuartoPorNumero(quartoNumero);
		const quarto = response.data; // Extrai o objeto do quarto

		if (quarto) {
			form.value.num_quarto = quarto.num_quarto;
			form.value.capa_adultos = quarto.capa_adultos;
			form.value.capa_criancas = quarto.capa_criancas;
			form.value.disponivel = quarto.id_hospede_responsavel === null;
		} else {
			toast.error('Quarto não encontrado.');
			router.push('/admin/quarto');
		}
	} catch (error) {
		toast.error('Falha ao carregar dados do quarto.');
		console.error('Erro ao buscar quarto:', error);
	} finally {
		carregando.value = false;
	}
});

function validarCampos() {
	erros.value = {};
	let valido = true;
	if (form.value.capa_adultos < 1) {
		erros.value.capa_adultos = 'A capacidade de adultos deve ser de no mínimo 1.';
		valido = false;
	}
	if (form.value.capa_criancas < 0) {
		erros.value.capa_criancas = 'A capacidade de crianças não pode ser negativa.';
		valido = false;
	}
	return valido;
}

async function salvarQuarto() {
	if (!validarCampos()) {
		toast.warning('Por favor, corrija os erros no formulário.');
		return;
	}

	carregando.value = true;
	try {
		const payload = {
			capa_adultos: form.value.capa_adultos,
			capa_criancas: form.value.capa_criancas,
			// A propriedade 'disponivel' foi removida do payload
		};
		// O método de atualização usa o número do quarto, não o ID.
		await QuartoService.atualizarQuarto(form.value.num_quarto, payload);
		toast.success('Quarto atualizado com sucesso!');
		router.push('/admin/quarto');
	} catch (error) {
		toast.error('Erro ao salvar as alterações.');
		console.error('Erro ao atualizar quarto:', error);
	} finally {
		carregando.value = false;
	}
}

async function excluirQuarto() {
	const result = await Swal.fire({
		title: 'Confirmar Exclusão',
		text: `Você realmente deseja excluir o Quarto ${form.value.num_quarto}?`,
		icon: 'warning',
		showCancelButton: false,
		confirmButtonColor: '#DD7373',
		confirmButtonText: 'Sim, excluir!',
	});

	if (result.isConfirmed) {
		carregando.value = true;
		try {
			await QuartoService.deletarQuarto(form.value.num_quarto);
			toast.success('Quarto excluído com sucesso!');
			router.push('/admin/quarto');
		} catch (error) {
			toast.error('Erro ao excluir o quarto.');
			console.error('Erro ao deletar quarto:', error);
		} finally {
			carregando.value = false;
		}
	}
}
</script>

<style scoped>
.pagina-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.formulario-quarto {
	display: flex;
	justify-content: center;
	margin-top: 2rem;
}

.coluna-campos {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	max-width: 400px;
}

.campo-grupo {
	display: flex;
	flex-direction: column;
}

.inputDado {
	border: 1px solid #DDDDE3;
	border-radius: 16px;
	height: 40px;
	padding: 0 15px;
	font-size: 1rem;
}

.inputDado:disabled {
	background-color: #f2f2f2;
	cursor: not-allowed;
}

.tituloInput {
	font-size: 14px;
	font-weight: 550;
	margin-bottom: 8px;
}

.hintErroInput {
	color: #DC363C;
	font-size: 12px;
	margin-top: 4px;
}

.hint-info {
	color: #78828A;
	font-size: 12px;
	margin-top: 4px;
}

.areaBotoes {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 2rem;
}

.botao-excluir {
	background-color: #DD7373;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 16px;
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.3s;
}

.botao-excluir:hover {
	background-color: #c0392b;
}

.botao-excluir:disabled {
	background-color: #f2f2f2;
	cursor: not-allowed;
}
</style>
