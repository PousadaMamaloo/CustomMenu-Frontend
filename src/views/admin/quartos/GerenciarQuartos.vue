<template>
  <div class="paginaQuartos">
    <div class="containerCabecalho">
      <BotaoVoltar destino="/" textPage="Gerenciar Quartos" />
      <div class="botoesDeAcao">
        <botaoFiltro class="filtroQuartos" @click="$emit('click')" />
        <button class="botaoConfiguracao">
          <span class="estiloIcone mdi mdi-cog"></span>
        </button>
      </div>
    </div>
    <ContainerCards :items="quartos">
      <template #default="{ item }">
        <CardQuarto :quarto="item" @editar="editarItem" />
      </template>
    </ContainerCards>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import CardQuarto from '/src/components/cards/CardQuarto.vue'
import botaoFiltro from '/src/components/botoes/botaoFiltro.vue'
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue'
import ContainerCards from '/src/components/ContainerCards.vue'

const quartos = ref([])

function editarItem(quarto) {
  // ação de editar
}

onMounted(() => {
  quartos.value = [
    { id: 1, nome: 'Quarto 101', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 2, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 3, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 1 },
    { id: 4, nome: 'Quarto 104', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 5, nome: 'Quarto 105', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 6, nome: 'Quarto 106', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 7, nome: 'Quarto 107', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 8, nome: 'Quarto 108', imagem: '/src/assets/333865190.jpg', qtdHospedes: 1 },
    { id: 9, nome: 'Quarto 109', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 10, nome: 'Quarto 110', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 11, nome: 'Quarto 111', imagem: '/src/assets/333865190.jpg', qtdHospedes: 1 },
    { id: 12, nome: 'Quarto 112', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 13, nome: 'Quarto 113', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 14, nome: 'Quarto 114', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 15, nome: 'Quarto 115', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 16, nome: 'Quarto 116', imagem: '/src/assets/333865190.jpg', qtdHospedes: 1 },
    { id: 17, nome: 'Quarto 117', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 }
  ]
})
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
}

.botoesDeAcao {
  display: flex;
  gap: 15px;
}

.botaoConfiguracao {
  background-color: #f8a953;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.botaoConfiguracao:hover {
  background-color: #ffa948;
}
</style>
