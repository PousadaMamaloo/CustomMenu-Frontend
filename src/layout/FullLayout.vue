<template>
    <div class="layout">
        <Cabecalho class="layout-cabecalho"/>
        <main class="layout-conteudo">
            <router-view />
        </main>
        <Rodape class="layout-rodape"/>
    </div>
</template>

<script setup> 
import Cabecalho from '../components/Cabecalho.vue';
import Rodape from '../components/Rodape.vue';
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.layout-cabecalho {
    flex: 1 1 5vh;
}
.layout-conteudo {
    flex: 1 1 85vh;
    overflow-y: auto;
}
.layout-rodape {
    flex: 1 1 10vh;
    background-color: #fbfafb;
}
</style>