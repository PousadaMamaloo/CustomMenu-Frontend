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
                        <!-- substituir pelas categorias da api -->
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
                <BotaoSalvar @click="salvarProduto" />
            </div>
        </form>

        <div v-if="mostrarToastSucesso" class="toast toastSucesso">
            <span class="mdi mdi-check-circle"></span>
            <span>{{ mensagemSucesso }}</span>
        </div>
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

const mostrarToastSucesso = ref(false);
const mensagemSucesso = ref('');
const carregando = ref(false);

function handleFile(file) {
    form.value.imagem = file;
}

function salvarProduto() {
    carregando.value = true;
    // Simulação de requisição para cadastrar
    setTimeout(() => {
        mensagemSucesso.value = 'Produto cadastrado com sucesso!';
        mostrarToastSucesso.value = true;
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

.toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    color: white;
    font-size: 14px;
    z-index: 1001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toastSucesso {
    background-color: #52c41a;
}

.toast span:first-child {
    margin-right: 8px;
    font-size: 16px;
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