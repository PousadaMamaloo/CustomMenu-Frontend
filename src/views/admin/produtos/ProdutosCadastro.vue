<template>
    <div class="paginaCadastroProduto">
        <button class="botaoVoltar" @click="mostrarModalSair = true">
            <span class="mdi mdi-chevron-left"></span>
            <span>{{ ehEdicao ? 'Editar produto' : 'Cadastrar produto' }}</span>
        </button>

        <form class="formularioCadastro" @submit.prevent="salvarProduto">
            <div class="campoFoto">
                <label for="fotoProduto" class="labelCampo">Foto do produto</label>
                <div class="caixaFoto">
                    <input type="file" id="fotoProduto" @change="handleImagem" hidden />
                    <label for="fotoProduto" class="inputImagem">
                        <img v-if="previewImagem" :src="previewImagem" alt="Prévia" class="imagemPreview" />
                        <span v-else class="mdi mdi-image-outline"></span>
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

        <ModalDialog v-if="mostrarModalSucesso" mensagem="Item salvo com sucesso" :icone="IconeSucesso" />

        <ModalDialog v-if="mostrarModalSair" mensagem="Tem certeza que deseja sair sem salvar?"
            :icone="IconeInterrogacao"
            :acaoPrimaria="{ texto: 'Continue editando', acao: () => mostrarModalSair = false }"
            :acaoSecundaria="{ texto: 'Voltar', acao: voltar }" />

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconeSucesso from '../../../assets/icons/sucesso.png'
import IconeInterrogacao from '../../../assets/icons/Interrogacao.png'
import ModalDialog from '../../../components/modal/ModalDialog.vue'

const route = useRoute()
const router = useRouter()

const ehEdicao = ref(!!route.params.id)
const previewImagem = ref(null)
const mostrarModalSucesso = ref(false)
const mostrarModalSair = ref(false)
const categorias = ref(['comida', 'bebida'])

const form = ref({
    nome: '',
    descricao: '',
    categoria: '',
    imagem: null
})

function voltar() {
    router.push('/admin/produto')
}

function handleImagem(event) {
    const arquivo = event.target.files[0]
    form.value.imagem = arquivo

    if (arquivo) {
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg']
        if (!tiposPermitidos.includes(arquivo.type)) {
            alert('Formato da imagem inválido. Use png, jpg ou jpeg.')
            return
        }

        const tamanhoMaximo = 2 * 1024 * 1024
        if (arquivo.size > tamanhoMaximo) {
            alert('Imagem muito grande. Máximo de 2MB.')
            return
        }

        const leitor = new FileReader()
        leitor.onload = e => {
            previewImagem.value = e.target.result
        }
        leitor.readAsDataURL(arquivo)
    }
}

function salvarProduto() {
    const erros = []

    if (!form.value.nome.trim()) {
        erros.push('Nome é obrigatório.')
    } else if (!/^[A-Za-zÀ-ÿ\s]{1,30}$/.test(form.value.nome)) {
        erros.push('Nome deve conter até 30 letras, sem números ou símbolos.')
    }

    if (form.value.descricao.length > 70) {
        erros.push('Descrição deve ter no máximo 70 caracteres.')
    }

    if (!form.value.categoria.trim()) {
        erros.push('Categoria é obrigatória.')
    }

    if (!ehEdicao.value && !form.value.imagem) {
        erros.push('Imagem é obrigatória.')
    }

    if (erros.length) {
        alert(erros[0])
        return
    }

    mostrarModalSucesso.value = true
    setTimeout(() => router.push('/admin/produto'), 4000)
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
    justify-items: center;
    overflow: hidden;
}

.inputImagem {
    font-size: 60px;
    color: #aaa;

}

.imagemPreview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.inputTexto,
.inputTextoArea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 12px;
    font-size: 14px;
}

.inputTexto {
    height: 36px;
}

.inputTextoArea {
    height: 82px;
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

    .imagemPreview {
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
