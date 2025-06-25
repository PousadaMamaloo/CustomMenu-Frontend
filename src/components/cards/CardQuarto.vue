<template>
  <BaseCard>
    <img class="imagemQuarto" src="/quarto_placeholder.png" />
    <div class="informacoesQuarto">
      <div class="container1">
        <p class="nomeQuarto">{{ quarto.nome }}</p>
        <div class="alinhamentoStatus">
          <span class="iconeCirculo mdi mdi-circle-medium"
            :class="quarto.disponivel ? 'statusLivre' : 'statusOcupado'"></span>
          <p class="statusQuarto" :class="quarto.disponivel ? 'statusLivre' : 'statusOcupado'">
            {{ quarto.status }}
          </p>
        </div>
      </div>
      <div class="container2">
        <div class="alinhamentoHospedes">
          <span class="iconeHospede mdi mdi-account-group"></span>
          <p class="qtdHospedes">
            Capacidade: {{ quarto.capacidade }}
            {{ quarto.capacidade === 1 ? 'pessoa' : 'pessoas' }}
          </p>
        </div>
      </div>
    </div>
    <div class="editarContainer">
      <botaoEditar @click="irParaEditar" />
    </div>
  </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseCard from './BaseCard.vue'
import botaoEditar from '/src/components/botoes/botaoEditar.vue'

const props = defineProps({
  quarto: {
    type: Object,
    required: true
  }
})

const router = useRouter();

function irParaEditar() {
  router.push(`/admin/quarto/editar/${props.quarto.numero}`);
}
</script>

<style scoped>
/* Padronização igual aos outros cards */
.baseCard,
.BaseCard {
  display: flex;
  align-items: center;
  flex: 1 1 350px;
  max-width: 400px;
  min-width: 350px;
  box-sizing: border-box;
  margin-bottom: 0;
  gap: 18px;
}

.imagemQuarto {
  width: 74px;
  height: 66px;
  border-radius: 10px;
  margin-right: 10px;
  object-fit: cover;
  background: #ededed;
}

.informacoesQuarto {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 0%;
  flex: 1;
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
  text-transform: uppercase;
}

.alinhamentoHospedes {
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

.editarContainer {
  margin-left: auto;
  display: flex;
  align-items: center;
}

@media (max-width: 800px) {

  .baseCard,
  .BaseCard {
    flex-basis: 100%;
    max-width: 100%;
    min-width: 0;
  }
}
</style>
