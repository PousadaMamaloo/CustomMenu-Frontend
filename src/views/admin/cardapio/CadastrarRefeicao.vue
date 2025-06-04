<template>
    <div class="paginaCadastroRefeicao">
        <BotaoVoltar destino="refeicao" textPage="Cadastrar Refeicao" />

        <FormularioRefeicao @salvar="RefeicaoSalvo" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FormularioRefeicao from '../../../components/FormularioRefeicao.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'

const router = useRouter()

function RefeicaoSalvo() {
    router.push('/admin/Refeicao')
}
</script>

<style scoped>
.paginaCadastroRefeicao {
    margin: 0 auto;
    padding: 20px;
}
</style>
