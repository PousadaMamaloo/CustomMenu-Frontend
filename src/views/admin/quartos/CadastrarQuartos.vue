<template>
  <div class="pagina-container">
    <BotaoVoltar destino="/admin/quarto" textPage="Cadastrar Quarto" />

    <form @submit.prevent="salvarQuarto">
      <div class="formulario-quarto">
        <div class="coluna-campos">
          <div class="campo-grupo">
            <label class="tituloInput">Número do Quarto</label>
            <input v-model.number="form.num_quarto" class="inputDado" type="number" placeholder="Ex: 101" />
            <p v-if="erros.num_quarto" class="hintErroInput">{{ erros.num_quarto }}</p>
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
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import QuartoService from '@/services/QuartoService';

const router = useRouter();
const toast = useToast();

const carregando = ref(false);
const form = ref({
  num_quarto: null,
  capa_adultos: 1,
  capa_criancas: 0,
});
const erros = ref({});

function validarCampos() {
  erros.value = {};
  let valido = true;

  if (!form.value.num_quarto) {
    erros.value.num_quarto = 'O número do quarto é obrigatório.';
    valido = false;
  } else if (form.value.num_quarto <= 0) {
    erros.value.num_quarto = 'O número do quarto deve ser positivo.';
    valido = false;
  }

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
    toast.warning('Por favor, preencha os campos corretamente.');
    return;
  }

  carregando.value = true;
  try {
    const payload = {
      num_quarto: Number(form.value.num_quarto),
      capa_adultos: form.value.capa_adultos,
      capa_criancas: form.value.capa_criancas,
    };
    await QuartoService.criarQuarto(payload);
    toast.success('Quarto cadastrado com sucesso!');
    router.push('/admin/quarto');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erro ao cadastrar o quarto. Verifique se o número já existe.';
    toast.error(errorMessage);
    console.error('Erro ao cadastrar quarto:', error);
  } finally {
    carregando.value = false;
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

.areaBotoes {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
