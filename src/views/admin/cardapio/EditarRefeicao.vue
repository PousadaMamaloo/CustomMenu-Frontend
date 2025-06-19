<template>
    <div class="paginaEditarRefeicao">
        <BotaoVoltar destino="refeicao" textPage="Editar Refeicao" />

        <FormularioRefeicao :RefeicaoId="RefeicaoId" @salvar="RefeicaoSalvo" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormularioRefeicao from '@/components/FormularioRefeicao.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'

const route = useRoute()
const router = useRouter()

const RefeicaoId = ref(route.params.id)

function RefeicaoSalvo() {
    router.push('/admin/Refeicaos')
}
</script>

<style scoped>
.paginaEditarRefeicao {
    margin: 0 auto;
    padding: 20px;
}
</style>
