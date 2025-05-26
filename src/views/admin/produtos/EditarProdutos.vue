<template>
    <div class="paginaCadastroProduto">
        <BotaoVoltar @click="voltarParaGerenciamento" />
        <form @submit.prevent="salvarProduto">
            <div class="conteudoFormulario">
                <div class="colunaImagem">
                    <div class="campoFoto">
                        <p class="tituloInput">Foto do produto</p>
                        <div class="caixaFoto">
                            <InputFoto v-model="form.imagem" label="Foto do Produto" :imagemUrl="form.imagemUrl"
                                @file-selected="handleFile" />
                        </div>
                    </div>
                </div>
                <div class="colunaCampos">
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Nome do Produto</label>
                        <input class="inputDadoCadastro" type="text" v-model="form.nome"
                            placeholder="Digite o nome do produto" />
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Descrição do Produto</label>
                        <textarea v-model="form.descricao" class="inputTextoArea"
                            placeholder="Escreva uma descrição para o produto" rows="4"></textarea>

                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Categoria do Produto</label>
                        <select v-model="form.categoria" class="inputTexto">
                            <option value="" disabled selected>Selecione uma categoria</option>
                            <option value="Comida">Comida</option>
                            <option value="Bebida">Bebida</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="areaBotoes">
                <button type="button" class="botaoApagar" @click="excluirProduto">
                    Apagar produto
                </button>
                <BotaoSalvar @click="salvarProduto" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';

const router = useRouter();
const route = useRoute();

const form = ref({
    id: null,
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null,
    imagemUrl: ''
});

const mensagemSucesso = ref('');
const carregando = ref(false);

// Busca dados do produto na inicialização
onMounted(() => {
    const id = route.params.id;
    if (id) {
        buscarProduto(id);
    }
});

function handleFile(file) {
    form.value.imagem = file;
}

function buscarProduto(id) {
    carregando.value = true;
    // Simulação de busca
    setTimeout(() => {
        // Mock
        form.value.id = id;
        form.value.nome = 'Tapioca recheada';
        form.value.descricao = 'Lorem ipsum dolor sit amet, elit. consectetur adipiscing elit Lorem ipsum dolor sit amet, elit. consectetur adipiscing';
        form.value.categoria = 'Comida';
        form.value.imagemUrl = '/mock/tapioca.jpg'; // Substitua pelo valor correto ao integrar
        carregando.value = false;
    }, 700);
}

function salvarProduto() {
    carregando.value = true;
    // Simulação de requisição para editar
    setTimeout(() => {
        mensagemSucesso.value = 'Produto atualizado com sucesso!';
        carregando.value = false;
        setTimeout(() => {
            router.push('/admin/produto');
        }, 2000);
    }, 1000);
}

function excluirProduto() {
    // Simulação de exclusão
    carregando.value = true;
    setTimeout(() => {
        mensagemSucesso.value = 'Produto excluído com sucesso!';
        carregando.value = false;
        setTimeout(() => {
            router.push('/admin/produto');
        }, 2000);
    }, 1000);
}

function voltarParaGerenciamento() {
    router.push('/admin/produto');
}
</script>

<style scoped>
.paginaCadastroProduto {
    max-width: 1200px;
    padding: 20px;
}

.linhaTituloInput {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.conteudoFormulario {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-inline: 20px;
}

.inputTexto,
.inputTextoArea {
    border: 1px solid #DDDDE3;
    border-radius: 16px;
    height: 36px;
    width: 100%;
    padding: 0px 10px 0px 10px !important;
    margin-bottom: 20px;
}

.inputTextoArea {
    resize: vertical;
    min-height: 100px;
}

@media (min-width: 768px) {

    .colunaCampos {
        flex: 2;
    }
}

.colunatestee {
    display: flex;
    flex-direction: column;
}

.botaoApagar {
    background: none;
    border: none;
    color: #f8a953;
    font-size: 14px;
    font-weight: medium;
    cursor: pointer;
    text-decoration: underline;
}

.botaoApagar:hover {
    background: #ffeaea;
}
</style>