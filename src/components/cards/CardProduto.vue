<template>
    <BaseCard>
        <img :src="dados.foto_item" alt="Imagem do produto" class="imagemProduto" />
        <div class="informacoesProduto">
            <div class="produtoTituloContainer">
                <h3 class="produtoTitulo">{{ dados.nome_item }}</h3>
            </div>
            <div class="produtoDescricaoContainer">
                <p class="produtoDescricao">{{ dados.desc_item }}</p>
            </div>
        </div>
        <div class="editarContainer">
            <botaoEditar @click="editarItem" />
        </div>
    </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from './BaseCard.vue'
import botaoEditar from '/src/components/botoes/botaoEditar.vue'

const props = defineProps({
    dados: Object
})

const router = useRouter()

function editarItem() {
    router.push(`/admin/produto/editar/${props.dados.id_item}`)
}
</script>

<style scoped>
/* Mesma base do CardQuarto */
.BaseCard,
.baseCard {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px;
    padding: 10px;
    max-width: 500px;
    flex: 1 1 300px;
}

.imagemProduto {
    width: 74px;
    height: 66px;
    border-radius: 10px;
    margin-right: 10px;
    object-fit: cover;
    background: #ededed;
}

.informacoesProduto {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding: 0%;
    flex: 1;
}

.produtoTituloContainer {
    height: 33px;
    align-items: start;
}

.produtoTitulo {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.produtoDescricaoContainer {
    height: 33px;
    align-items: start;
}

.produtoDescricao {
    font-size: 10px;
    font-weight: 400;
    color: #828696;
    margin: 0;
}

.editarContainer {
    margin-left: auto;
    display: flex;
    align-items: center;
}
</style>
