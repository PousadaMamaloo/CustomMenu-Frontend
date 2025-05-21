<template>
  <div class="paginaCadastroProduto">
    <BotaoVoltar @click="voltarParaGerenciamento" />
    <form @submit.prevent="salvarProduto">
      <div class="conteudoFormulario">
        <div class="colunaImagem">
          <div class="campoFoto">
            <p class="tituloInput">Foto do produto</p>
            <div class="caixaFoto">
                <InputFoto 
                    v-model="fotoQuarto"
                    label="Foto do Quarto"
                    @file-selected="handleFile"
                />
            </div>
          </div>
        </div>

        <div class="colunaCampos">
                <label class="tituloInput">Nome do Produto</label>
                <input class="inputDadoCadastro" type="text" v-model="form.nome" placeholder="Digite o nome do produto"/>

                <label class="tituloInput">Categoria do Produto</label>
                    <select v-model="form.categoria" class="inputTexto">
                        <option value="" disabled selected>Selecione uma categoria</option>
                        <option value="Comida">Comida</option>
                        <option value="Bebida">Bebida</option>
                        <option value="Frutas">Frutas</option>
                        <option value="Outros">Outros</option>
                    </select>

                <label class="tituloInput">Descrição do Produto</label>
                <textarea v-model="form.descricao" class="inputTextoArea"
                    placeholder="Escreva uma descrição para o produto" rows="4"></textarea>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import BotaoSalvar from '/src/components/botoes/botaoSalvar.vue';
import InputFoto from '/src/components/inputFoto.vue';
import BotaoVoltar from '../../../components/botoes/botaoVoltar.vue';

const router = useRouter();
const route = useRoute();

const form = ref({
    id: null,
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null
});

// Estado da interface
const mostrarToastSucesso = ref(false);
const mensagemSucesso = ref('');
const carregando = ref(false);

// Verifica se estamos em modo de edição
const ehEdicao = computed(() => {
    return !!form.value.id;
});


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
            };

            // Preenche o formulário
            form.value.id = produtoMock.id;
            form.value.nome = produtoMock.nome;
            form.value.descricao = produtoMock.descricao;
            form.value.categoria = produtoMock.categoria;

          
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
    // try {
    //     const dadosEnvio = new FormData();
    //     dadosEnvio.append('nome', form.value.nome);
    //     dadosEnvio.append('descricao', form.value.descricao);
    //     dadosEnvio.append('categoria', form.value.categoria);
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


/* imagem */
.campoFoto {
    margin-bottom: 20px;
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