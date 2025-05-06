<template>
    <div class="cardProduto">
        <div class="cardProdutoImagem">
            <img :src="imagemUrl" alt="Imagem do produto">
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
import { ref, computed } from 'vue'

const props = defineProps({
    idProduto: {
        type: [Number, String],
        required: true
    }
})

const dados = ref({
    titulo: 'Pão Francês',
    descricao: 'Um pão crocante e leve, teste teste teste teste teste teste teste teste teste teste.',
    imagem: 'pao-frances.jpg'
})

const imagemUrl = computed(() => `/mock/${dados.value.imagem}`)
</script>

<style scoped>
.cardProduto {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    padding: 12px;
    margin-left: 12px;
    max-width: 344px;
    max-height: 88px;
}
.cardProdutoImagem {
    width: 74px;
    height: 66px;
    object-fit: cover;
    border-radius: 12px;
    margin-right: 12px;
    background-color: orange;
    font-size: 15px;
}
.cardProdutoConteudo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    height: 66px;
}
.cardProdutoTituloContainer, .cardProdutoDescricaoContainer {
    height: 33px;
    align-items:start;
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
}
</style>


<!-- <template>
    <div class="cardProduto">
        <template v-if="carregando">
            <p>Carregando</p>
        </template>

        <template v-else>
            <img :src="imagemUrl" :alt="dados.titulo" class="cardProdutoImagem" />
            <div class="cardProdutoConteudo">
                <h3 class="cardProdutoTitulo">{{ dados.titulo }}</h3>
                <p class="cardProdutoDescricao">{{ dados.descricao }}</p>
            </div>
            <button class="cardProtudoBotao" @click="editarItem">Editar</button>
        </template>

    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import axios from 'axios'

    const props = defineProps({
        id: {type: [Number, String], required: true}
    })

    const router = useRoute()
    const carregando = ref(true)
    const dados = ref({})

    onMounted(async () => {
        carregando.value = true
        try {
            const resposta = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/produtos/${props.id}`)
            dados.value = resposta.data
        } catch (erro) {
            console.error('Erro ao carregar os dados do produto:', erro)
        } finally {
            carregando.value = false
        }
    })

    const imagemUrl = computed(() => {
        return `${import.meta.env.VITE_API_BASE_URL}/uploads/${dados.value.imagem}`
    })

    function editarItem() {
        router.push(`/admin/produtos/editar/${props.id}`)
    }
</script>

<style scoped>
.cardProduto {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 12px;
    margin-bottom: 12px;
}
.cardProdutoImagem {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    margin-right: 12px;
}
.cardProdutoConteudo {
  flex: 1;
}
.cardProdutoTitulo {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}
.cardProdutoDescricao {
  color: #888;
  font-size: 14px;
}
.cardProdutoBotao {
  background: none;
  border: none;
  color: #607d8b;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}
</style> -->
