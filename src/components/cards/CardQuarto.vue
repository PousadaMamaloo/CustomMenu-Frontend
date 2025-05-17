<template>
    <div 
      class="componenteQuartos" 
      v-for="quarto in quartos" 
      :key="quarto.id"
    >
      <img class="imagemQuarto" :src="quarto.imagem" />
      <div class="informacoesQuarto">
        <div class="container1">
          <p class="nomeQuarto">{{ quarto.nome }}</p>
          <div class="alinhamentoStatus">
            <span class="iconeCirculo mdi mdi-circle-medium"
            :class="quarto.qtdHospedes > 0 ? 'statusOcupado' : 'statusLivre'"
            ></span>
            <p class="statusQuarto"
              :class="quarto.qtdHospedes > 0 ? 'statusOcupado' : 'statusLivre'">
              {{ quarto.qtdHospedes > 0 ? 'Ocupado' : 'Livre' }}
            </p>
          </div>
        </div>
        <div class="container2">
          <div class="alinhamentoHospedes">
              <span class="iconeHospede mdi mdi-account"></span>
              <p class="qtdHospedes">
                {{ quarto.qtdHospedes }} 
                {{ quarto.qtdHospedes === 1 ? 'hóspede' : 'hóspedes' }}
              </p>
          </div>
        </div>
      </div>
      <botaoEditar @click="editarItem" />
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import botaoEditar from '/src/components/botoes/botaoEditar.vue'

// Simulação da resposta do backend
const quartos = ref([])

const editarItem = (quarto) => {
  console.log('Editar quarto:', quarto)
}

onMounted(() => {
  quartos.value = [
    { id: 1, nome: 'Quarto 101', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 2, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 3, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 4, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 5, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 6, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 7, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 1, nome: 'Quarto 101', imagem: '/src/assets/333865190.jpg', qtdHospedes: 0 },
    { id: 2, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 3, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 4, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 5, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 },
    { id: 6, nome: 'Quarto 102', imagem: '/src/assets/333865190.jpg', qtdHospedes: 2 },
    { id: 7, nome: 'Quarto 103', imagem: '/src/assets/333865190.jpg', qtdHospedes: 3 }
  ]
})
</script>
  
<style>
.componenteQuartos {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
  border-radius: 12px; 
  background-color: white;
  display: flex;
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  max-width: 500px;
  flex: 1 1 300px; /* Cresce até o máximo permitido */
}

.imagemQuarto {
  width: 74px;
  height: 66px;
  border-radius: 10px;
  margin-right: 10px;
}

.informacoesQuarto {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 0%;
 }

 .nomeQuarto {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.alinhamentoStatus {
  display: flex;
  align-items: center;
}

.iconeCirculo {
  font-size: 16px;
  margin-left: -3px;
} 

.statusLivre {
  color: #8DDD73;
}

.statusOcupado {
  color: #E87A7A; 
}

.statusQuarto {
  font-size: 8px;
  font-weight: 500;
}

.alinhamentoHospedes{
  display: flex;
  align-items: center;
}

.iconeHospede {
  font-size: 11px;
  color: #78828A;
}
.qtdHospedes {
font-size: 8px;
font-weight: 500;
color: #78828A;
margin: 0; 
}

</style>