<template>
    <div class="cardProduto">
        <div class="cardProdutoFoto">
            <img :src="imagemUrl" alt="Imagem do produto" class="cardProdutoImagem">
        </div>
        <div class="cardProdutoConteudo">
            <div class="cardProdutoTituloContainer">
                <h3 class="cardProdutoTitulo">{{ dados.titulo }}</h3>
            </div>
            <div class="cardProdutoDescricaoContainer">
                <p class="cardProdutoDescricao">{{ dados.descricao }}</p>
            </div>
        </div>
        <botaoEditar @click="editarItem" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import botaoEditar from '/src/components/botoes/botaoEditar.vue'

const props = defineProps({
    dados: Object
})

const router = useRouter()

const imagemUrl = computed(() => `/mock/${props.dados.imagem}`)

function editarItem() {
    router.push(`/admin/produto/editar/${props.dados.id}`)
}
</script>

<style scoped>
.cardProduto {
    display: flex;
    align-items: center;
    border-radius: 16px;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    width: 100%;
    height: 88px;
}

.cardProdutoFoto {
    display: flex;
    justify-content: center;
    width: 25%;
}

.cardProdutoImagem {
    width: 80%;
    height: 66px;
    background-color: #78828a;
    border-radius: 10px;
}

.cardProdutoConteudo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    height: 66px;
    width: 55%;
}

.cardProdutoTituloContainer,
.cardProdutoDescricaoContainer {
    height: 33px;
    align-items: start;
}

.cardProdutoTitulo {
    font-size: 15px;
    font-weight: semibold;
}

.cardProdutoDescricao {
    font-size: 10px;
    font-weight: light;
    color: #828696;
}

@media (min-width: 1200px) {
    .cardProduto {
        width: 500px;
        height: 140px;
    }

    .cardProdutoImagem {
        width: 130px;
        height: 116px;
    }

    .cardProdutoFoto {
        width: 35%;
    }

    .cardProdutoConteudo {
        width: 35%;
    }
}
</style>