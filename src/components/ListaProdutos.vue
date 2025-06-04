<template>
    <div class="gridCategorias">
        <div v-for="(produtos, categoria) in produtosPorCategoria" :key="categoria" class="blocoCategoria">
            <h2 class="tituloCategoria">{{ categoria }}</h2>
            <div class="itensCategoria">
                <CardProduto v-for="produto in produtos" :key="produto.id" :dados="produto" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import CardProduto from '../components/cards/CardProduto.vue'

const props = defineProps({
    produtos: {
        type: Array,
        required: true
    },
    categoriasSelecionadas: {
        type: Array,
        default: () => []
    }
})

const produtosFiltrados = computed(() => {
    if (props.categoriasSelecionadas.length === 0) return props.produtos

    return props.produtos.filter(p =>
        props.categoriasSelecionadas.includes(p.categoria)
    )
})

const produtosPorCategoria = computed(() => {
    return produtosFiltrados.value.reduce((acc, produto) => {
        if (!acc[produto.categoria]) acc[produto.categoria] = []
        acc[produto.categoria].push(produto)
        return acc
    }, {})
})
</script>


<style scoped>
.gridCategorias {
    display: grid;
    gap: 24px;
}

/* Desktop: duas colunas lado a lado */
@media (min-width: 1200px) {
    .gridCategorias {
        grid-template-columns: repeat(2, 1fr);
    }
}

.blocoCategoria {
    padding: 16px;
    border-radius: 12px;
}

.tituloCategoria {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #27272a;
}

.itensCategoria {
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    gap: 12px;
}
</style>
