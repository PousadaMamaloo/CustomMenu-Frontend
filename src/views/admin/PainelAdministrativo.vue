<template>
  <div class="painelContainer">
    <div class="painelBoasVindas">
      <span class="painelOla">Olá, Volney!</span>
      <h2 class="painelTitulo">Comece a gerenciar</h2>
    </div>
    <div class="painelOpcoes">
      <button v-for="(opcao, index) in opcoes" :key="index" class="painelCard" @click="router.push(opcao.rota)">
        <div class="painelIcone">
          <span :class="['mdi', opcao.icone]"></span>
        </div>
        <div class="painelCardTitulo">{{ opcao.titulo }}</div>
      </button>
    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const opcoes = [
  {
    titulo: 'Gerenciar Produtos',
    icone: 'mdi-weather-windy',
    rota: '/admin/produto',
  },
  {
    titulo: 'Gerenciar Quartos',
    icone: 'mdi-bed',
    rota: '/admin/quarto',
  },
  {
    titulo: 'Gerenciar Pedidos',
    icone: 'mdi-silverware',
    rota: '/admin/pedidos',
  },
  {
    titulo: 'Gerenciar Cardápio',
    icone: 'mdi-clipboard-list-outline',
    rota: '/admin/refeicao',
  },
  {
    titulo: 'Gerenciar Hóspedes',
    icone: 'mdi-account-group',
    rota: '/admin/hospedes',
  },
]
</script>


<style scoped>
@media (max-width: 764px) {
  .painelContainer {
    margin-left: 0;
    margin-top: 28px;
    gap: 28px;
    padding: 0 8px;
  }

  .painelBoasVindas {
    margin-bottom: 8px;
    padding-left: 6px;
  }

  .painelOla {
    font-size: 13px;
  }

  .painelTitulo {
    font-size: 18px;
    margin: 0 0 18px 0;
    padding-left: 1px;
  }

  .painelOpcoes {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .painelCard {
    width: 64px;
    height: 108px;
    align-items: center;
    border: none;
    background-color: #fff;
  }

  .painelIcone {
    width: 56px;
    height: 56px;
    font-size: 26px;
    background-color: #f8a95366;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
  }

  .painelCardTitulo {
    font-size: 13px;
    color: #6c727f;
    text-align: center;
    margin-top: 2px;
    line-height: 1.12;
    white-space: pre-line;
  }
}

@media (min-width: 764px) {
  .painelContainer {
    display: flex;
    flex-direction: column;
    gap: 36px;
    margin-left: 80px;
    margin-top: 56px;
  }

  .painelBoasVindas {
    margin-bottom: 12px;
  }

  .painelOla {
    font-size: 15px;
    color: #222;
  }

  .painelTitulo {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }

  .painelOpcoes {
    display: flex;
    flex-wrap: wrap;
  }

  .painelCard {
    width: 300px;
    height: 227px;
    border: none;
    padding: 0;
    background-color: #fff;
    border-radius: 22px;
    box-shadow: 0 4px 18px 0 #00000014;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 34px;
    justify-content: center;
    transition: box-shadow 0.2s;
    cursor: pointer;
    margin: 10px;
  }

  .painelCard:hover {
    box-shadow: 0 8px 28px 0 #00000024;
  }

  .painelIcone {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    font-size: 38px;
    margin-bottom: 18px;
    background-color: #f8a95366;
    border-radius: 50%;
  }

  .painelCardTitulo {
    font-size: 17px;
    color: #6c727f;
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    text-align: center;
  }
}
</style>