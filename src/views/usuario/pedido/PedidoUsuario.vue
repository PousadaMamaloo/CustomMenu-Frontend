<template>
    <div class="containerPedido">
        <div class="tituloAdicionar">
            <h1 class="tituloPagina">Gerenciar Produto</h1>
            <button class="botaoAdicionar">Adicionar</button>
        </div>
        <div class="tituloFiltro">
            <h2 class="tituloProdutos">Produtos</h2>
            <button class="filtroProdutos"><span class="mdi mdi-tune-variant"></span></button>
        </div>
    </div>
    <div class="listaProdutos">
        <CardProduto
            v-for="id in listaIds"
            :key="id"
            :idProduto="id"
        />
    </div>
</template>

<script setup>
import CardProduto from '../../../components/cards/CardProduto.vue'

const listaIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // substituir pela lista do banco de dados
</script>

<style scoped>
.containerPedido {
    padding: 20px;
}
.tituloAdicionar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.tituloFiltro {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.tituloPagina {
    font-size: 20px;
    font-weight: 700;
    color: #27272A;
}
.botaoAdicionar {
    background-color: #f8a953;
    color: white;
    height: 37px;
    width: 78px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    align-items: center;
    justify-content: center;
}
.tituloProdutos {
    font-size: 18px;
    font-weight: 700;
}
.filtroProdutos {
    background-color: #f8a953;
    color: white;
    height: 30px;
    width: 30px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}
.listaProdutos {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>