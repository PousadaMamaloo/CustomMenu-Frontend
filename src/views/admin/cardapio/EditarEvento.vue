<template>
    <div class="paginaEditarEvento">
        <BotaoVoltar destino="evento" textPage="Editar Evento" />

        <FormularioEvento :eventoId="eventoId" @salvar="eventoSalvo" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormularioEvento from '../../../components/FormularioEvento.vue'
import BotaoVoltar from '@/components/botoes/BotaoVoltar.vue'

const route = useRoute()
const router = useRouter()

const eventoId = ref(route.params.id)

function eventoSalvo() {
    router.push('/admin/eventos')
}
</script>

<style scoped>
.paginaEditarEvento {
    margin: 0 auto;
    padding: 20px;
}
</style>
