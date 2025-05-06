<template>
    <div class="layout">
        <Cabecalho class="layoutCabecalho"/>
        <main class="layoutConteudo">
            <router-view />
        </main>
        <Rodape class="layoutRodape"/>
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
.layoutCabecalho {
    flex: 1 1 5vh;    
}
.layoutConteudo {
    flex: 1 1 85vh;
    overflow-y: auto;
}
.layoutRodape {
    flex: 1 1 10vh;
    background-color: #fbfafb;
}
</style>