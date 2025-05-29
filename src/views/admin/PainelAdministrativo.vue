<template>
  <div class="painelContainer">
    <div class="painelBoasVindas">
      <span class="painelOla">Olá, Volney!</span>
      <h2 class="painelTitulo">Comece a gerenciar</h2>
    </div>
    <div class="painelOpcoes">
      <button class="painelCard" @click="irParaProdutos">
        <div class="painelIcone"><span class="mdi mdi-weather-windy"></span></div>
        <div class="painelCardTitulo">Gerenciar Produtos</div>
      </button>
      <button class="painelCard" @click="irParaQuartos">
        <div class="painelIcone"><span class="mdi mdi-bed"></span></div>
        <div class="painelCardTitulo">Gerenciar Quartos</div>
      </button>
      <button class="painelCard" @click="irParaPedidos">
        <div class="painelIcone"><span class="mdi mdi-silverware"></span></div>
        <div class="painelCardTitulo">Gerenciar Pedidos</div>
      </button>
      <button class="painelCard" @click="irParaCardapio">
        <div class="painelIcone"><span class="mdi mdi-clipboard-list-outline"></span></div>
        <div class="painelCardTitulo">Gerenciar Cardápio</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function irParaProdutos() {
  router.push('/admin/produto')
}
function irParaQuartos() {
  router.push('/admin/quarto')
}
function irParaPedidos() {
  // Ajuste aqui caso exista tela de pedidos
  // Exemplo:
  // router.push('/admin/pedidos')
  alert('Funcionalidade "Gerenciar Pedidos" ainda não implementada!')
}
function irParaCardapio() {
  // Ajuste aqui caso exista tela de cardápio
  // Exemplo:
  // router.push('/admin/cardapio')
  alert('Funcionalidade "Gerenciar Cardápio" ainda não implementada!')
}
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
    justify-content: space-between;
    gap: 36px 28px;
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
