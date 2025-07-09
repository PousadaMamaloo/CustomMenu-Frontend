<template>
    <div class="paginaCadastroProduto">
        <!-- Corrigido o destino para ser um caminho válido -->
        <BotaoVoltar class="botaoVoltar" destino="/admin/produto" textPage="Cadastrar Produto" />
        <form class="formCadastroProduto" @submit.prevent="salvarProduto">
            <div class="conteudoFormulario">
                <div class="colunaImagem">
                    <div class="campoFoto">
                        <p class="tituloInput">Foto do produto</p>
                        <div class="caixaFoto">
                            <InputFoto label="Foto do Produto" :imagemUrl="form.imagemUrl"
                                @file-selected="handleFile" />
                        </div>
                        <span v-if="erros.foto_item" class="erroCampo">{{ erros.foto_item }}</span>
                    </div>
                </div>
                <div class="colunaCampos">
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Nome do Produto<span class="obrigatorio">*</span></label>
                        <input class="inputDadoCadastro" type="text" v-model="form.nome_item"
                            placeholder="Digite o nome do produto" />
                        <span v-if="erros.nome_item" class="erroCampo">{{ erros.nome_item }}</span>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Descrição do Produto</label>
                        <textarea v-model="form.desc_item" class="inputTextoArea"
                            placeholder="Escreva uma descrição para o produto" rows="4"></textarea>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Categoria do Produto<span class="obrigatorio">*</span></label>
                        <select v-model="form.categ_item" class="inputTexto">
                            <option value="" disabled>Selecione uma categoria</option>
                            <option v-for="categoria in categoriasDisponiveis" :key="categoria" :value="categoria">
                                {{ categoria }}
                            </option>
                        </select>
                        <span v-if="erros.categ_item" class="erroCampo">{{ erros.categ_item }}</span>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Valor (R$)<span class="obrigatorio">*</span></label>
                        <input class="inputDadoCadastro" type="number" step="0.01" v-model="form.valor_item"
                            placeholder="Ex: 15.50" />
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Qtd. Máx. por Hóspede<span class="obrigatorio">*</span></label>
                        <input class="inputDadoCadastro" type="number" v-model="form.qntd_max_hospede"
                            placeholder="Ex: 2" />
                    </div>
                </div>
            </div>
            <div class="areaBotoes">
                <BotaoSalvar type="submit" />
            </div>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
// import imageCompression from 'browser-image-compression';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import ProdutoService from '@/services/ProdutoService';

const router = useRouter();
const toast = useToast();

const form = ref({
    nome_item: '',
    desc_item: '',
    categ_item: '',
    foto_item: '', // Armazena a string base64 para envio
    valor_item: null,
    qntd_max_hospede: 1,
    imagemUrl: '' // Apenas para exibir a imagem (preview)
});

const erros = ref({});
const categoriasDisponiveis = ref([]);
const carregando = ref(false);

onMounted(async () => {
    try {
        categoriasDisponiveis.value = await ProdutoService.listarCategorias();
    } catch (error) {
        toast.error('Falha ao carregar as categorias.');
    }
});

function handleFile(file) {
    if (!file) {
        form.value.foto_item = '';
        form.value.imagemUrl = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        form.value.foto_item = base64String;
        form.value.imagemUrl = base64String;
    };
    reader.readAsDataURL(file);
}

function validarCampos() {
    erros.value = {};
    let valido = true;

    if (!form.value.nome_item.trim()) {
        erros.value.nome_item = 'Nome do produto é obrigatório.';
        valido = false;
    }
    if (!form.value.categ_item) {
        erros.value.categ_item = 'Categoria do produto é obrigatória.';
        valido = false;
    }
    if (!form.value.foto_item) {
        erros.value.foto_item = 'A foto do produto é obrigatória.';
        valido = false;
    }
    return valido;
}

async function salvarProduto() {
    if (!validarCampos()) return;
    carregando.value = true;

    const payload = {
        nome_item: form.value.nome_item,
        desc_item: form.value.desc_item,
        categ_item: form.value.categ_item,
        foto_item: form.value.foto_item,
        valor_item: Number(form.value.valor_item),
        qntd_max_hospede: Number(form.value.qntd_max_hospede)
    };

    try {
        await ProdutoService.criarProduto(payload);
        toast.success('Produto cadastrado com sucesso!');
        router.push({ path: '/admin/produto', query: { sucesso: 1 } });
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao cadastrar o produto.';
        toast.error(errorMessage);
    } finally {
        carregando.value = false;
    }
}
</script>


<style scoped>
.paginaCadastroProduto {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
}

.formCadastroProduto {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
}

.erroCampo {
    color: #e24c3f;
    font-size: 13px;
    display: block;
}

.obrigatorio {
    color: #DC363C;
}

.botaoVoltar {
    margin-bottom: 20px;
    align-self: flex-start;
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
