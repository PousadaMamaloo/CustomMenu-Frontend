<template>
    <div class="paginaCadastroProduto">
        <div class="cabecalho">
            <button class="botaoVoltar" @click="confirmarSair">
                <span class="mdi mdi-chevron-left"></span>
                <span>{{ ehEdicao ? 'Editar produto' : 'Cadastro de produtos' }}</span>
            </button>
        </div>

        <form @submit.prevent="salvarProduto">
            <div class="conteudoFormulario">
                <div class="colunaImagem">
                    <div class="campoFoto">
                        <p class="tituloInput">Foto do produto</p>
                        <div class="caixaFoto">
                            <input type="file" id="fotoProduto" @change="handleImagem" accept="image/*" hidden />
                            <label for="fotoProduto" class="inputImagem">
                                <img v-if="previewImagem" :src="previewImagem" alt="Prévia" class="imagemPreview" />
                                <div v-else class="placeholderImagem">
                                    <span class="mdi mdi-image-outline"></span>
                                </div>
                                <div v-if="ehEdicao" class="botaoEditarImagem">
                                    <span class="mdi mdi-pencil"></span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="colunaCampos">
                    <div class="tituloInput">
                        <label>Nome do Produto</label>
                        <input type="text" v-model="form.nome" class="inputTexto" placeholder="Digite o nome do produto"
                            required />
                    </div>

                    <div class="tituloInput">
                        <label>Categoria do Produto</label>
                        <div class="campoSelect">
                            <select v-model="form.categoria" class="inputTexto" required>
                                <option value="" disabled selected>Selecione uma categoria</option>
                                <option value="Comida">Comida</option>
                                <option value="Bebida">Bebida</option>
                                <option value="Frutas">Frutas</option>
                                <option value="Outros">Outros</option>
                            </select>
                            <span class="mdi mdi-chevron-down iconeSelect"></span>
                        </div>
                    </div>

                    <div class="tituloInput">
                        <label>Descrição do Produto</label>
                        <textarea v-model="form.descricao" class="inputTextoArea"
                            placeholder="Escreva uma descrição para o produto" rows="4"></textarea>
                    </div>
                </div>
            </div>

            <div class="areaBotoes">
                <BotaoSalvar :carregando="carregando" @click="salvarProduto" />
                <button v-if="ehEdicao" type="button" class="botaoApagar" @click="confirmarExclusao">
                    Apagar produto
                </button>
            </div>
        </form>

        <ModalGenerico :modalState="modalState" :fecharModal="fecharModal" />

        <div v-if="mostrarToastSucesso" class="toast toastSucesso">
            <span class="mdi mdi-check-circle"></span>
            <span>{{ mensagemSucesso }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalGenerico from '../../../components/modal/ModalDialog.vue';
import BotaoSalvar from '../../../components/botaoSalvar.vue';
import { useModalController, TIPOS_MODAL } from '../../../composables/useModalController.js';

const router = useRouter();
const route = useRoute();

const { modalState, exibirModal, fecharModal } = useModalController();

const form = ref({
    id: null,
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null
});

// Estado da interface
const previewImagem = ref(null);
const mostrarToastSucesso = ref(false);
const mensagemSucesso = ref('');
const carregando = ref(false);

// Verifica se estamos em modo de edição
const ehEdicao = computed(() => {
    return !!form.value.id;
});

// Função para lidar com o upload de imagem
function handleImagem(event) {
    const arquivo = event.target.files[0];
    if (arquivo) {
        form.value.imagem = arquivo;

        // Cria preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImagem.value = e.target.result;
        };
        reader.readAsDataURL(arquivo);
    }
}

// Busca dados do produto se estiver em modo de edição
async function buscarProduto(id) {
    carregando.value = true;
    try {
        // Simulação de chamada à API
        // Na implementação real seria:
        // const response = await axios.get(`/api/produtos/${id}`);
        // const produto = response.data;

        // Mock para demonstração
        setTimeout(() => {
            // Simula resposta da API
            const produtoMock = {
                id: id,
                nome: 'Tapioca recheada',
                descricao: 'Lorem ipsum dolor sit amet, elit. consectetur adipiscing elit Lorem ipsum dolor sit amet, elit. consectetur adipiscing',
                categoria: 'Comida',
                imagemUrl: previewImagem.value // Na versão real viria da API
            };

            // Preenche o formulário
            form.value.id = produtoMock.id;
            form.value.nome = produtoMock.nome;
            form.value.descricao = produtoMock.descricao;
            form.value.categoria = produtoMock.categoria;

            // Se houver imagem na resposta
            if (produtoMock.imagemUrl) {
                previewImagem.value = produtoMock.imagemUrl;
            }

            carregando.value = false;
        }, 500);
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
        carregando.value = false;
        exibirToast('Erro ao carregar dados do produto');
    }
}

// Salva o produto (criar ou atualizar)
async function salvarProduto() {
    carregando.value = true;

    try {
        // Preparar dados para envio (incluindo FormData para imagem)
        const dadosEnvio = new FormData();
        dadosEnvio.append('nome', form.value.nome);
        dadosEnvio.append('descricao', form.value.descricao);
        dadosEnvio.append('categoria', form.value.categoria);

        if (form.value.imagem) {
            dadosEnvio.append('imagem', form.value.imagem);
        }

        if (ehEdicao.value) {
            // Requisição PUT para editar produto existente
            // await axios.put(`/api/produtos/${form.value.id}`, dadosEnvio);
            console.log('PUT /api/produto/' + form.value.id, { ...form.value });
            mensagemSucesso.value = 'Produto atualizado com sucesso!';

            // Exibe modal de sucesso
            exibirModal('SUCESSO_EDICAO', {
                acaoPrimaria: voltarParaListagem
            });
        } else {
            // Requisição POST para criar novo produto
            // const response = await axios.post('/api/produtos', dadosEnvio);
            console.log('POST /api/produto', { ...form.value });
            mensagemSucesso.value = 'Produto cadastrado com sucesso!';

            // Exibe modal de sucesso
            exibirModal('SUCESSO_CADASTRO', {
                acaoPrimaria: voltarParaListagem
            });
        }

        carregando.value = false;
    } catch (erro) {
        console.error('Erro ao salvar produto:', erro);
        exibirToast('Erro ao salvar produto');
        carregando.value = false;

        // Exibe modal de erro
        exibirModal('ERRO_GENERICO', {
            acaoPrimaria: () => {
                fecharModal();
            }
        });
    }
}

// Confirmar antes de sair da página
function confirmarSair() {
    // Verifica se há alterações para decidir se mostra o modal
    if (form.value.nome || form.value.descricao || form.value.categoria || form.value.imagem) {
        exibirModal('SAIR_SEM_SALVAR', {
            acaoPrimaria: voltarParaListagem,
            acaoSecundaria: fecharModal
        });
    } else {
        voltarParaListagem();
    }
}

// Confirmação antes de excluir
function confirmarExclusao() {
    exibirModal('CONFIRMACAO_EXCLUSAO', {
        mensagem: `Deseja realmente excluir o produto "${form.value.nome}"?`,
        acaoPrimaria: excluirProduto,
        acaoSecundaria: fecharModal
    });
}

// Excluir produto
async function excluirProduto() {
    fecharModal();
    carregando.value = true;

    try {
        // Requisição DELETE para remover produto
        // await axios.delete(`/api/produtos/${form.value.id}`);
        console.log('DELETE /api/produto/' + form.value.id);

        // Exibe modal confirmando exclusão com sucesso
        exibirModal('SUCESSO_EXCLUSAO', {
            acaoPrimaria: voltarParaListagem
        });
    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        exibirToast('Erro ao excluir produto');
        carregando.value = false;

        // Exibe modal de erro
        exibirModal('ERRO_GENERICO', {
            acaoPrimaria: fecharModal
        });
    }
}

// Exibe o toast com mensagem
function exibirToast(mensagem) {
    mensagemSucesso.value = mensagem;
    mostrarToastSucesso.value = true;

    // Esconde o toast após 3 segundos
    setTimeout(() => {
        mostrarToastSucesso.value = false;
    }, 3000);
}

// Voltar para a listagem de produtos
function voltarParaListagem() {
    fecharModal();
    router.push('/admin/produto');
}

// Inicialização
onMounted(() => {
    // Verifica se há um ID na rota para determinar se é edição
    const id = route.params.id;
    if (id) {
        form.value.id = id;
        buscarProduto(id);
    }
});
</script>

<style scoped>
.paginaCadastroProduto {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.cabecalho {
    margin-bottom: 24px;
}

.botaoVoltar {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    padding: 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
}

.botaoVoltar span:first-child {
    margin-right: 8px;
}


.conteudoFormulario {
    padding: 24px;
}


/**.campoTexto label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}**/

.inputTexto,
.inputTextoArea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.inputTexto:focus,
.inputTextoArea:focus {
    border-color: #f8a427;
    outline: none;
}

.inputTextoArea {
    resize: vertical;
    min-height: 100px;
}

/* select */
.campoSelect {
    position: relative;
}

.iconeSelect {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #666;
}

/* imagem */
.campoFoto {
    margin-bottom: 20px;
}

.caixaFoto {
    position: relative;
    width: 100%;
    max-width: 240px;
    aspect-ratio: 1/1;
    margin: 0 auto;
}

.inputImagem {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    background-color: #f5f5f5;
}

.placeholderImagem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #aaa;
    font-size: 48px;
}

.imagemPreview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.botaoEditarImagem {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f8a427;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

/* botões */
.areaBotoes {
    padding: 16px 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    gap: 12px;
}

.botaoApagar {
    padding: 10px;
    background-color: transparent;
    color: #f86f3e;
    border: none;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
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
    .conteudoFormulario {
        display: flex;
        gap: 30px;
    }

    .colunaImagem {
        flex: 1;
    }

    .colunaCampos {
        flex: 2;
    }

    .areaBotoes {
        padding: 24px;
    }
}
</style>