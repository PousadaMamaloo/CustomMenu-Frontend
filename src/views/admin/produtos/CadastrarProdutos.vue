<template>
    <div class="paginaCadastroProduto">
        <BotaoVoltar @click="voltarParaGerenciamento" />
        <form @submit.prevent="salvarProduto">
            <div class="conteudoFormulario">
                <div class="colunaImagem">
                    <div class="campoFoto">
                        <p class="tituloInput">Foto do produto</p>
                        <div class="caixaFoto">
                            <InputFoto v-model="form.imagem" label="Foto do Produto" @file-selected="handleFile" />
                        </div>
                        <span v-if="erros.imagem" class="erroCampo">{{ erros.imagem }}</span>
                    </div>
                </div>
                <div class="colunaCampos">
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Nome do Produto</label>
                        <input class="inputDadoCadastro" type="text" v-model="form.nome"
                            placeholder="Digite o nome do produto" />
                        <span v-if="erros.nome" class="erroCampo">{{ erros.nome }}</span>
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
                        <span v-if="erros.categoria" class="erroCampo">{{ erros.categoria }}</span>
                    </div>
                </div>
            </div>
            <div class="areaBotoes">
                <BotaoSalvar @click="salvarProduto" />
            </div>
        </form>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';

const router = useRouter();

const form = ref({
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null
});

const erros = ref({
    nome: '',
    categoria: '',
    imagem: ''
});

const mensagemSucesso = ref('');
const carregando = ref(false);

function handleFile(file) {
    form.value.imagem = file;
}

function validarCampos() {
    // Limpa mensagens de erro anteriores
    erros.value.nome = '';
    erros.value.categoria = '';
    erros.value.imagem = '';
    let valido = true;

    if (!form.value.nome.trim()) {
        erros.value.nome = 'Nome do produto é obrigatório.';
        valido = false;
    }
    if (!form.value.categoria.trim()) {
        erros.value.categoria = 'Categoria do produto é obrigatória.';
        valido = false;
    }
    if (!form.value.imagem) {
        erros.value.imagem = 'A foto do produto é obrigatória.';
        valido = false;
    }
    return valido;
}

function salvarProduto() {
    if (!validarCampos()) return;
    carregando.value = true;
    setTimeout(() => {
        mensagemSucesso.value = 'Produto cadastrado com sucesso!';
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

.erroCampo {
    color: #e24c3f;
    font-size: 13px;
    display: block;
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
</style>