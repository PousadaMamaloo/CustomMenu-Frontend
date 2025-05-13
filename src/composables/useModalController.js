// Modal personalizado para cada tipo de situação
export const TIPOS_MODAL = {
    SAIR_SEM_SALVAR: {
        titulo: 'Deseja sair sem salvar?',
        mensagem: 'Todas as alterações serão perdidas.',
        icone: '/icones/atencao.svg',
        textoBotaoPrimario: 'Sair sem salvar',
        textoBotaoSecundario: 'Continuar editando'
    },
    CONFIRMACAO_EXCLUSAO: {
        titulo: 'Excluir produto',
        mensagem: 'Deseja realmente excluir este produto?',
        icone: '/icones/excluir.svg',
        textoBotaoPrimario: 'Excluir',
        textoBotaoSecundario: 'Cancelar'
    },
    SUCESSO_CADASTRO: {
        titulo: 'Sucesso!',
        mensagem: 'Produto cadastrado com sucesso!',
        icone: '/icones/sucesso.svg',
        textoBotaoPrimario: 'Voltar para listagem',
        textoBotaoSecundario: null
    },
    SUCESSO_EDICAO: {
        titulo: 'Sucesso!',
        mensagem: 'Produto atualizado com sucesso!',
        icone: '/icones/sucesso.svg',
        textoBotaoPrimario: 'Voltar para listagem',
        textoBotaoSecundario: null
    },
    SUCESSO_EXCLUSAO: {
        titulo: 'Sucesso!',
        mensagem: 'Produto excluído com sucesso!',
        icone: '/icones/sucesso.svg',
        textoBotaoPrimario: 'Voltar para listagem',
        textoBotaoSecundario: null
    },
    ERRO_GENERICO: {
        titulo: 'Erro',
        mensagem: 'Ocorreu um erro. Por favor, tente novamente.',
        icone: '/icones/erro.svg',
        textoBotaoPrimario: 'Tentar novamente',
        textoBotaoSecundario: 'Cancelar'
    }
};

// Hook do modal:
import { reactive } from 'vue';

export function useModalController() {
    const modalState = reactive({
        visivel: false,
        mensagem: '',
        icone: '',
        acaoPrimaria: null,
        acaoSecundaria: null
    });

    function exibirModal(tipo, opcoes = {}) {
        const configuracao = TIPOS_MODAL[tipo];
        if (!configuracao) {
            console.error(`Tipo de modal não encontrado: ${tipo}`);
            return;
        }
        modalState.visivel = true;
        modalState.mensagem = opcoes.mensagem || configuracao.mensagem;
        modalState.icone = opcoes.icone || configuracao.icone;
        modalState.acaoPrimaria = {
            texto: opcoes.textoBotaoPrimario || configuracao.textoBotaoPrimario,
            acao: opcoes.acaoPrimaria || (() => { modalState.visivel = false; })
        };
        if (configuracao.textoBotaoSecundario || opcoes.textoBotaoSecundario) {
            modalState.acaoSecundaria = {
                texto: opcoes.textoBotaoSecundario || configuracao.textoBotaoSecundario,
                acao: opcoes.acaoSecundaria || (() => { modalState.visivel = false; })
            };
        } else {
            modalState.acaoSecundaria = null;
        }
    }

    function fecharModal() {
        modalState.visivel = false;
    }

    return { modalState, exibirModal, fecharModal };
}
