<template>
    <div class="paginaCadastroProduto">
        <button class="botaoVoltar" @click="voltar">
            <span class="mdi mdi-chevron-left"></span>
            <span>{{ ehEdicao ? 'Editar produto' : 'Cadastrar produto' }}</span>
        </button>
        <form class="formularioCadastro" @submit.prevent="salvarProduto">
            <div class="campoFoto">
                <label for="fotoProduto" class="labelCampo">Foto do produto</label>
                <div class="caixaFoto">
                    <input type="file" id="fotoProduto" @change="handleImagem" hidden />
                    <label for="fotoProduto" class="inputImagem">
                        <span class="mdi mdi-image-outline"></span>
                    </label>
                </div>
            </div>

            <div class="campoTexto">
                <label for="nome" class="labelCampo">Nome do produto</label>
                <input type="text" id="nome" v-model="form.nome" class="inputTexto" />
            </div>

            <div class="campoTexto">
                <label for="descricao" class="labelCampo">Descrição do produto</label>
                <textarea id="descricao" v-model="form.descricao" class="inputTextoArea"></textarea>
            </div>

            <div class="campoTexto">
                <label for="categoria" class="labelCampo">Categoria</label>
                <input type="text" id="categoria" v-model="form.categoria" class="inputTexto"
                    list="categoriasSugestao" />
                <datalist id="categoriasSugestao">
                    <option v-for="categoria in categorias" :key="categoria" :value="categoria" />
                </datalist>
            </div>


            <div class="campoBotao">
                <button type="submit" class="botaoSalvar">Salvar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const ehEdicao = ref(!!route.params.id)

const form = ref({
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null
})

const categorias = ref([])

onMounted(async () => {
    try {
        const resposta = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categorias`)
        categorias.value = resposta.data

        if (ehEdicao.value) {
            const respostaProduto = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/produtos/${route.params.id}`)
            form.value = {
                nome: respostaProduto.data.nome,
                descricao: respostaProduto.data.descricao,
                categoria: respostaProduto.data.categoria,
                imagem: null // você pode manter nulo e só mudar se usuário reenvia
            }
        }
    } catch (err) {
        console.error(err)
    }
})

function voltar() {
    router.push('/admin/produto')
}

function handleImagem(event) {
    form.value.imagem = event.target.files[0]
}

async function salvarProduto() {
    try {
        if (ehEdicao.value) {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/produtos/${route.params.id}`, form.value)
        } else {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/produtos`, form.value)
        }
        router.push('/admin/produto')
    } catch (err) {
        console.error('Erro ao salvar produto:', err)
    }
}

</script>

<style scoped>
.paginaCadastroProduto {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: black;
    font-weight: 600;
}

.botaoVoltar {
    font-size: 18px;
}

.botaoVoltar .mdi {
    font-size: 20px;
}

.formularioCadastro {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-inline: 20px;
}

.campoTexto,
.campoFoto {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.labelCampo {
    font-size: 14px;
}

.caixaFoto {
    width: 130px;
    height: 130px;
    border: 1px solid #ddd;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.inputImagem {
    font-size: 60px;
    color: #aaa;
}

.inputTexto,
.inputTextoArea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 12px;
    font-size: 14px;
}

.inputTextoArea {
    height: 80px;
    resize: none;
}

.botaoSalvar {
    margin-top: 20px;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 32px;
    background: linear-gradient(to right, #f8a953, #d48946);
    color: white;
    font-size: 18px;
}

@media (min-width: 769px) {
    .paginaCadastroProduto {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 16px;
    }

    .formularioCadastro {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 40px;
        row-gap: 24px;
        align-items: start;
        max-width: 900px;
    }

    .campoFoto {
        grid-column: 1;
        grid-row: 1 / span 3;
        width: 380px;
    }

    .caixaFoto {
        width: 310px;
        height: 310px;
    }

    .inputImagem {
        font-size: 180px;
    }

    .campoTexto {
        width: 380px;
    }

    .campoBotao {
        grid-column: 1 / span 2;
        display: flex;
        justify-content: center;
    }

    .botaoSalvar {
        justify-self: end;
        width: 330px;
        margin-top: 24px;
    }
}
</style>
