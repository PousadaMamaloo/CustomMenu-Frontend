<template>
  <div class="containerPagina">
    <div class="cabecalho">
      <BotaoVoltar destino="/admin" textPage="Gerenciar Quartos" />
      
      <FiltroGenerico
        :items="listaQuartos"
        filter-key="status"
        title="Filtrar por Status"
        @update:filtered-items="quartosProcessados = $event"
      >
        <template #default="{ selecaoTemporaria, updateSelecao }">
          <div class="opcoes-filtro">
            <button
              :class="['botao-opcao', { ativo: !selecaoTemporaria.length }]"
              @click="updateSelecao([])"
            >
              Todos
            </button>
            <button
              :class="['botao-opcao', { ativo: selecaoTemporaria.includes('LIVRE') }]"
              @click="updateSelecao(['LIVRE'])"
            >
              Livres
            </button>
            <button
              :class="['botao-opcao', { ativo: selecaoTemporaria.includes('OCUPADO') }]"
              @click="updateSelecao(['OCUPADO'])"
            >
              Ocupados
            </button>
          </div>
        </template>
      </FiltroGenerico>
    </div>

    <div class="gridConteudo">
      <CardQuarto 
        v-for="quarto in quartosProcessados" 
        :key="quarto.id" 
        :quarto="quarto"
        @editar="editarQuarto" 
      />
      <p v-if="!quartosProcessados.length">Nenhum quarto encontrado para este filtro.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'
import FiltroGenerico from '@/components/FiltroGenerico.vue'
import CardQuarto from '@/components/cards/CardQuarto.vue'

const allQuartos = ref([
  { id: 1, nome: 'Quarto 101', imagem: 'https://via.placeholder.com/150', qtdHospedes: 0 },
  { id: 2, nome: 'Quarto 102', imagem: 'https://via.placeholder.com/150', qtdHospedes: 2 },
  { id: 3, nome: 'Quarto 103', imagem: 'https://via.placeholder.com/150', qtdHospedes: 1 },
  { id: 4, nome: 'Suíte 201', imagem: 'https://via.placeholder.com/150', qtdHospedes: 0 },
  { id: 5, nome: 'Quarto 202', imagem: 'https://via.placeholder.com/150', qtdHospedes: 3 },
])

const listaQuartos = computed(() => {
  return allQuartos.value.map(quarto => ({
    ...quarto,
    status: quarto.qtdHospedes > 0 ? 'OCUPADO' : 'LIVRE'
  }))
})

const quartosProcessados = ref([])

function editarQuarto(quarto) {
  console.log('Editando o quarto:', quarto.nome)
}
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