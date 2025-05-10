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
        <div class="cardProdutoBotaoEditar">
            <button @click="editarItem">Editar</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    dados: Object
})

const router = useRouter()

const imagemUrl = computed(() => `/mock/${props.dados.imagem}`)

function editarItem() {
    router.push(`/admin/produtos/editar/${props.dados.id}`)
}
</script>

<style scoped>
.cardProduto {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    width: 100%;
    height: 88px;
}

.cardProdutoFoto {
    display: flex;
    justify-content: center;
    width: 30%;
}

.cardProdutoImagem {
    width: 80%;
    height: 66px;
}

.cardProdutoConteudo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    height: 66px;
    width: 50%;
}

.cardProdutoTituloContainer,
.cardProdutoDescricaoContainer {
    height: 33px;
    align-items: start;
}

.cardProdutoTitulo {
    font-size: 15px;
    font-weight: 600;
}

.cardProdutoDescricao {
    font-size: 10px;
    font-weight: 300;
    color: #828696;
}

.cardProdutoBotaoEditar {
    font-size: 14px;
    font-weight: 600;
    color: #78828a;
    width: 20%;
    justify-items: center;
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
}
</style>