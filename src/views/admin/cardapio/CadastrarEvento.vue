<template>
    <div class="paginaCadastroEvento">
        <BotaoVoltar destino="evento" textPage="Cadastrar Evento" />

        <FormularioEvento @salvar="eventoSalvo" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FormularioEvento from '../../../components/FormularioEvento.vue'
import BotaoVoltar from '@/components/botoes/botaoVoltar.vue'

const router = useRouter()

function eventoSalvo() {
    router.push('/admin/evento')
}
</script>

<style scoped>
.paginaCadastroEvento {
    margin: 0 auto;
    padding: 20px;
}
</style>
