<template>
  <div class="paginaQuartos">
    <div class="containerCabecalho">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Quartos" />
      <div class="botoesDeAcao">
        <botaoFiltro class="filtroQuartos" @click="abrirModalFiltro" />
        <button class="botaoConfiguracao" @click="navegarParaCadastro">
          <span class="estiloIcone mdi mdi-plus"></span> Novo Quarto
        </button>
      </div>
    </div>
    <div v-if="carregando" class="loading-mensagem">Carregando quartos...</div>
    <div v-if="!carregando && erro" class="erro-mensagem">{{ erro }}</div>
    <ContainerCards v-if="!carregando && !erro && quartos.length > 0" :items="quartosFormatados">
      <template #default="{ item }">
        <CardQuarto :quarto="item" @editar="editarItem" @deletar="confirmarDelecao" />
      </template>
    </ContainerCards>
    <div v-if="!carregando && !erro && quartos.length === 0" class="sem-quartos">
      Nenhum quarto encontrado.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Para feedback ao usuário

import CardQuarto from '/src/components/cards/CardQuarto.vue';
import botaoFiltro from '/src/components/botoes/botaoFiltro.vue';
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import ContainerCards from '/src/components/ContainerCards.vue';
import QuartoService from '@/services/QuartoService'; // Importar o serviço

const quartos = ref([]);
const carregando = ref(true);
const erro = ref(null);

const router = useRouter();
const toast = useToast();

const quartosFormatados = computed(() => {
  if (!Array.isArray(quartos.value)) {
    console.warn('quartos.value is not an array:', quartos.value);
    return [];
  }
  return quartos.value.map(apiQuarto => {
    // Determine if the room is occupied based on id_hospede_responsavel
    const isOcupado = apiQuarto.id_hospede_responsavel !== null;

    // Calculate total guests if occupied, otherwise 0 for display in CardQuarto
    // CardQuarto uses qtdHospedes to determine "Livre" or "Ocupado" status text
    // and also to display the number of guests.
    // If the room is "Livre" (id_hospede_responsavel is null), qtdHospedes should be 0 for CardQuarto's logic.
    // If it's "Ocupado", sum capa_adultos and capa_criancas.
    let qtdHospedesParaCard;
    if (isOcupado) {
      qtdHospedesParaCard = (apiQuarto.capa_adultos || 0) + (apiQuarto.capa_criancas || 0);
      // Ensure at least 1 guest if marked as occupied but capacities are 0 (unlikely scenario but safe)
      if (qtdHospedesParaCard === 0) qtdHospedesParaCard = 1;
    } else {
      qtdHospedesParaCard = 0; // For "Livre" status in CardQuarto
    }

    return {
      // Properties expected by CardQuarto.vue
      id: apiQuarto.id_quarto, // Pass the original ID for actions like edit/delete
      imagem: '/src/assets/default-room-image.jpg', // Placeholder image
      nome: String(apiQuarto.num_quarto), // Room number as name
      qtdHospedes: qtdHospedesParaCard, // This will drive the "Livre/Ocupado" logic and guest count in CardQuarto

      // You can also pass original API data if needed for other operations not directly used by CardQuarto display
      // originalData: apiQuarto 
    };
  });
});

async function carregarQuartos() {
  carregando.value = true;
  erro.value = null;
  try {
    const data = await QuartoService.listarQuartos();
    quartos.value = data;
  } catch (apiError) {
    console.error("Falha ao carregar quartos:", apiError);
    erro.value = apiError.message || 'Não foi possível carregar os quartos. Tente novamente mais tarde.';
    toast.error(erro.value);
  } finally {
    carregando.value = false;
  }
}

function editarItem(quarto) {
  // Ação de editar - o 'quarto' aqui será o objeto formatado
  console.log('Editar quarto:', quarto);
  // Você precisará do ID original ou número para a API
  const quartoOriginal = quartos.value.find(q => q.id === quarto.id);
  if (quartoOriginal) {
    // router.push(`/admin/quarto/editar/${quartoOriginal.numero}`); // Exemplo de navegação
    toast.info(`Editar quarto: ${quartoOriginal.numero}`);
  }
}

async function confirmarDelecao(quarto) {
  // Ação de deletar - o 'quarto' aqui será o objeto formatado
  const quartoOriginal = quartos.value.find(q => q.id === quarto.id);
  if (quartoOriginal) {
    if (confirm(`Tem certeza que deseja deletar o quarto ${quartoOriginal.numero}?`)) {
      try {
        await QuartoService.deletarQuarto(quartoOriginal.numero);
        toast.success(`Quarto ${quartoOriginal.numero} deletado com sucesso!`);
        carregarQuartos(); // Recarrega a lista
      } catch (apiError) {
        const mensagemErro = apiError.message || `Erro ao deletar quarto ${quartoOriginal.numero}.`;
        toast.error(mensagemErro);
        console.error("Erro ao deletar quarto:", apiError);
      }
    }
  }
}

function navegarParaCadastro() {
  // router.push('/admin/quarto/cadastro'); // Exemplo de navegação
  toast.info("Navegar para cadastro de novo quarto.");
}

function abrirModalFiltro() {
  toast.info("Abrir modal de filtro.");
}

onMounted(() => {
  carregarQuartos();
});
</script>

<style>
.paginaQuartos {
  padding: 24px 16px 0 16px;
  margin: 0 auto;
  max-width: 900px;
  box-sizing: border-box;
}

.containerCabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.tituloQuartos {
  font-size: 20px;
  /* Não usado diretamente no template atual, mas mantido */
}

.botoesDeAcao {
  display: flex;
  gap: 15px;
}

.botaoConfiguracao {
  background-color: #f8a953;
  /* Laranja */
  border: none;
  padding: 10px 15px;
  /* Ajuste no padding */
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  /* Ajuste no tamanho da fonte */
}

.botaoConfiguracao .estiloIcone {
  margin-right: 8px;
  /* Espaço entre ícone e texto */
}


.botaoConfiguracao:hover {
  background-color: #e7903c;
  /* Laranja mais escuro */
}

.loading-mensagem,
.erro-mensagem,
.sem-quartos {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #555;
}

.erro-mensagem {
  color: red;
}
</style>
