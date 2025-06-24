<template>
    <div class="paginaCadastroProduto">
        <BotaoVoltar destino="produto" textPage="Editar Produto" />
        <form @submit.prevent="salvarProduto">
            <div class="conteudoFormulario">
                <div class="colunaImagem">
                    <div class="campoFoto">
                        <p class="tituloInput">Foto do produto</p>
                        <div class="caixaFoto">
                            <!-- Corrigido v-model e erros -->
                            <InputFoto label="Foto do Produto" :imagemUrl="form.imagemUrl"
                                @file-selected="handleFile" />
                        </div>
                        <span v-if="erros.foto_item" class="erroCampo">{{ erros.foto_item }}</span>
                    </div>
                </div>
                <div class="colunaCampos">
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Nome do Produto</label>
                        <!-- Corrigido v-model e erros -->
                        <input class="inputDadoCadastro" type="text" v-model="form.nome_item"
                            placeholder="Digite o nome do produto" />
                        <span v-if="erros.nome_item" class="erroCampo">{{ erros.nome_item }}</span>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Descrição do Produto</label>
                        <!-- Corrigido v-model -->
                        <textarea v-model="form.desc_item" class="inputTextoArea"
                            placeholder="Escreva uma descrição para o produto" rows="4"></textarea>
                    </div>
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Categoria do Produto</label>
                        <!-- Corrigido v-model e erros -->
                        <select v-model="form.categ_item" class="inputTexto">
                            <option value="" disabled>Selecione uma categoria</option>
                            <option v-for="categoria in categoriasDisponiveis" :key="categoria" :value="categoria">
                                {{ categoria }}
                            </option>
                        </select>
                        <span v-if="erros.categ_item" class="erroCampo">{{ erros.categ_item }}</span>
                    </div>
                    <!-- Adicionado campo Valor -->
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Valor (R$)</label>
                        <input class="inputDadoCadastro" type="number" step="0.01" v-model="form.valor_item"
                            placeholder="Ex: 15.50" />
                    </div>
                    <!-- Adicionado campo Quantidade Máxima -->
                    <div class="linhaTituloInput">
                        <label class="tituloInput">Qtd. Máx. por Hóspede</label>
                        <input class="inputDadoCadastro" type="number" v-model="form.qntd_max_hospede"
                            placeholder="Ex: 2" />
                    </div>
                </div>
            </div>
            <div class="areaBotoes">
                <button type="button" class="botaoApagar" @click="excluirProduto">
                    Apagar produto
                </button>
                <!-- Corrigido evento de clique -->
                <BotaoSalvar type="submit" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification'; // 1. Importe o useToast
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '/src/components/botoes/botaoVoltar.vue';
import ProdutoService from '@/services/ProdutoService';

const router = useRouter();
const route = useRoute();
const toast = useToast(); // 2. Inicialize o toast
const produtoId = route.params.id;

const form = ref({
    nome_item: '',
    desc_item: '',
    categ_item: '',
    foto_item: '', // Armazena a string base64 para envio
    valor_item: 0,
    qntd_max_hospede: 1,
    imagemUrl: '' // Apenas para exibir a imagem (preview ou existente)
});

// Corrigido objeto de erros
const erros = ref({});
const categoriasDisponiveis = ref([]);
const carregando = ref(false);

onMounted(async () => {
    carregando.value = true;
    try {
        categoriasDisponiveis.value = await ProdutoService.listarCategorias();
        const produto = await ProdutoService.obterProdutoPorId(produtoId);
        if (produto) {
            form.value.nome_item = produto.nome_item;
            form.value.desc_item = produto.desc_item;
            form.value.categ_item = produto.categ_item;
            form.value.valor_item = produto.valor_item;
            form.value.qntd_max_hospede = produto.qntd_max_hospede;
            form.value.imagemUrl = produto.foto_item;
        } else {
            router.push('/admin/produto');
        }
    } catch (error) {
        toast.error('Falha ao carregar dados do produto.');
        console.error("Erro ao carregar dados do produto:", error);
    } finally {
        carregando.value = false;
    }
});

function handleFile(file) {
    if (!file) {
        form.value.foto_item = '';
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

// Corrigida a lógica de validação
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
    // A foto não é obrigatória na edição
    return valido;
}

async function salvarProduto() {
    if (!validarCampos()) {
        toast.warning('Por favor, preencha os campos obrigatórios.');
        return;
    }
    carregando.value = true;

    const payload = {
        nome_item: form.value.nome_item,
        desc_item: form.value.desc_item,
        categ_item: form.value.categ_item,
        valor_item: Number(form.value.valor_item),
        qntd_max_hospede: Number(form.value.qntd_max_hospede),
    };

    if (form.value.foto_item) {
        payload.foto_item = form.value.foto_item;
    }

    try {
        await ProdutoService.atualizarProduto(produtoId, payload);
        toast.success('Produto atualizado com sucesso!');
        router.push({ path: '/admin/produto', query: { sucesso: 1 } });
    } catch (error) {
        // 3. Use o toast para mostrar o erro de atualização
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao atualizar o produto.';
        toast.error(errorMessage);
        console.error("Erro ao atualizar produto:", error);
    } finally {
        carregando.value = false;
    }
}

// Corrigida a função de exclusão para usar o serviço
async function excluirProduto() {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você realmente deseja apagar este produto? Esta ação não pode ser desfeita.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        carregando.value = true;
        try {
            await ProdutoService.deletarProduto(produtoId);
            toast.success('Produto excluído com sucesso!');
            router.push({ path: '/admin/produto', query: { sucesso: 1 } });
        } catch (error) {
            // 4. Use o toast para mostrar o erro de exclusão
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao excluir o produto.';
            toast.error(errorMessage);
            console.error("Erro ao excluir produto:", error);
        } finally {
            carregando.value = false;
        }
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
