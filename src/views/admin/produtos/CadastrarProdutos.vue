<template>
    <div class="paginaCadastroProduto">
        <!-- Corrigido o destino para ser um caminho válido -->
        <BotaoVoltar destino="produto" textPage="Cadastrar Produto" />
        <form @submit.prevent="salvarProduto">
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
                        <label class="tituloInput">Nome do Produto</label>
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
                        <label class="tituloInput">Categoria do Produto</label>
                        <select v-model="form.categ_item" class="inputTexto">
                            <option value="" disabled>Selecione uma categoria</option>
                            <option v-for="categoria in categoriasDisponiveis" :key="categoria" :value="categoria">
                                {{ categoria }}
                            </option>
                        </select>
                        <span v-if="erros.categ_item" class="erroCampo">{{ erros.categ_item }}</span>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Valor (R$)</label>
                        <input class="inputDadoCadastro" type="number" step="0.01" v-model="form.valor_item"
                            placeholder="Ex: 15.50" />
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Qtd. Máx. por Hóspede</label>
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
import imageCompression from 'browser-image-compression';

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
    foto_item: '', // Armazena a string base64 PURA para envio
    valor_item: null,
    qntd_max_hospede: 1,
    imagemUrl: '' // Armazena a DATA URI completa para o preview
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

async function handleFile(file) {
    if (!file) {
        form.value.foto_item = '';
        form.value.imagemUrl = '';
        return;
    }

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        fileType: 'image/jpeg',
    }

    try {
        carregando.value = true;
        toast.info('Comprimindo a imagem, por favor aguarde...', { timeout: 2000 });

        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onload = (e) => {
            const fullDataUrl = e.target.result;
            form.value.imagemUrl = fullDataUrl;
            form.value.foto_item = fullDataUrl.split(',')[1];

            // 1. Toast de sucesso após a compressão e leitura.
            toast.success('Imagem comprimida com sucesso!');

            // 2. Console.log para teste no navegador.
            // Você pode copiar a string do "Data URI" e colar na barra de endereço do navegador para ver a imagem.
            console.log('--- Base64 Data URI (para teste no navegador) ---');
            console.log(form.value.imagemUrl);
        };
        reader.onerror = () => {
            toast.error('Ocorreu um erro ao processar a imagem comprimida.');
        };
        reader.readAsDataURL(compressedFile);

    } catch (error) {
        toast.error('Não foi possível comprimir a imagem. Tente outra, por favor.');
        console.error(error);
    } finally {
        carregando.value = false;
    }
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
        // O toast de sucesso pode ser adicionado aqui, mas o redirecionamento já tem uma mensagem.
        router.push({ path: '/admin/produto', query: { sucesso: 1 } });
    } catch (error) {
        // 3. Use o toast para mostrar o erro
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao cadastrar o produto.';
        toast.error(errorMessage);
        console.error('Erro ao cadastrar produto:', error);
    } finally {
        carregando.value = false;
    }
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
