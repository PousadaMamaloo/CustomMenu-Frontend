<template>
  <Loading v-if="carregando" />
  <div class="containerPagina">
    <div class="cabecalho">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Quartos" />
      <div class="acoes">
        <BotaoAdicionar @click="irParaCadastro" />

        <FiltroGenerico :items="listaQuartos" filter-key="status" title="Filtrar por Status"
          @update:filtered-items="quartosProcessados = $event">
          <template #default="{ selecaoTemporaria, updateSelecao }">
            <div class="opcoes-filtro">
              <button :class="['botao-opcao', { ativo: !selecaoTemporaria.length }]" @click="updateSelecao([])">
                Todos
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria[0] === 'LIVRE' }]"
                @click="updateSelecao(['LIVRE'])">
                Livres
              </button>
              <button :class="['botao-opcao', { ativo: selecaoTemporaria[0] === 'OCUPADO' }]"
                @click="updateSelecao(['OCUPADO'])">
                Ocupados
              </button>
            </div>
          </template>
        </FiltroGenerico>
      </div>

    </div>

    <div class="gridConteudo">
      <CardQuarto v-for="quarto in quartosProcessados" :key="quarto.id" :quarto="quarto" />

      <p v-if="!quartosProcessados.length">Nenhum quarto encontrado para este filtro.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import BotaoAdicionar from '@/components/botoes/botaoAdicionar.vue'
import FiltroGenerico from '@/components/FiltroGenerico.vue'
import CardQuarto from '@/components/cards/CardQuarto.vue'
import QuartoService from '@/services/QuartoService'
import Loading from '@/components/Loading.vue'

/**
 * View para gerenciar todos os quartos do estabelecimento.
 * Exibe os quartos em cards, mostrando seu status (livre/ocupado) e
 * capacidade. Permite filtrar por status e acessar as funções de
 * adicionar e editar quartos.
 */

const router = useRouter()
const toast = useToast()

const allQuartos = ref([])
const carregando = ref(true)

function irParaCadastro() {
  router.push('/admin/quarto/cadastro');
}

onMounted(async () => {
  try {
    const quartos = await QuartoService.listarQuartos();
    allQuartos.value = quartos;
    quartosProcessados.value = listaQuartos.value; // Inicializa a lista para exibição
  } catch (error) {
    toast.error('Falha ao carregar a lista de quartos.')
  } finally {
    carregando.value = false
  }
})

const listaQuartos = computed(() => {
  if (!allQuartos.value || !Array.isArray(allQuartos.value)) return [];
  return allQuartos.value.map(quarto => {
    const disponivel = quarto.id_hospede_responsavel === null;
    const capacidadeTotal = quarto.capa_adultos + quarto.capa_criancas;
    return {
      // Mapeia os dados da API para o formato esperado pelo card
      ...quarto,
      id: quarto.id_quarto,
      numero: quarto.num_quarto,
      nome: `Quarto ${quarto.num_quarto}`,
      imagem: '/quarto_placeholder.png',
      disponivel: disponivel,
      status: disponivel ? 'LIVRE' : 'OCUPADO',
      capacidade: capacidadeTotal,
    };
  });
});

const quartosProcessados = ref([])

</script>

<style scoped>
.containerPagina {
  padding: 24px 16px 0 16px;
  margin: 0 auto;
  max-width: 900px;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.gridConteudo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.opcoes-filtro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.acoes {
  display: flex;
  gap: 16px;
}

.botao-opcao {
  width: 100%;
  padding: 12px;
  text-align: left;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.botao-opcao.ativo {
  background-color: #fff8f0;
  border-color: #f8a953;
  font-weight: bold;
}
</style>