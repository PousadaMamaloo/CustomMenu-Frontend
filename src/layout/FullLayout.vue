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
.layoutConteudo {
    flex-grow: 1;
}

/* Estilos para telas maiores que 768px (tablets e desktops) */
@media (min-width: 769px) {
  .layoutCabecalho {
    height: 150px;
  }

  .layoutConteudo {
    min-height: 800px;
  }

  .layoutRodape {
    height: 150px;
  }
}

/* Estilos para dispositivos móveis com largura até 768px */
@media (max-width: 768px) {
  .layoutCabecalho {
    height: 100px;
  }

  .layoutConteudo {
    min-height: 600px;
  }

  .layoutRodape {
    height: 100px;
  }
}
</style>
